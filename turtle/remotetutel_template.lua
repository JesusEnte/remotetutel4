SERVER_URL = '' -- empty cuz template

websocket_url = string.format('%s/ws/turtles', SERVER_URL)
websocket = nil

function main()
    --make terminal pretty
    term.clear()
    term.setCursorPos(1,1)
    print(string.format('#%d: %s\n\n', os.computerID(), os.computerLabel()))

    --try to connect to websocket
    websocket, err = http.websocket(websocket_url)
    if err then
        print(string.format('Couldn\'t connect to %s, retrying in 20 seconds\nError: %s', websocket_url, err))
        sleep(20)
        os.reboot()
    end

    --connection info
    websocket.send(textutils.serialiseJSON({type='authentication', id=tostring(os.computerID())}))

    --receive and eval messages
    function process_websocket_message()

        msg = websocket.receive()

        if msg == nil then
            print('Server closed connection, rebooting in 20 seconds')
            sleep(20)
            os.reboot()
        end

        msg = textutils.unserialiseJSON(msg)
        if not msg.type then return end
        
        if msg.type == 'eval' and msg.code then
            
            func = load(msg.code)
            result = {pcall(func)}
            if not result[1] then
                print(string.format('Error: %s', result[2]))
            end

            function to_json()
                return textutils.serialiseJSON({type='evalresponse', data=result})
            end
            json_result = {pcall(to_json)}

            if not json_result[1] then
                websocket.send(textutils.serialiseJSON({type='evalresponse', data={false, "JSON Error"}}))
            else
                websocket.send(json_result[2])
            end
            
        elseif msg.type == 'close' then
            websocket.close()
            print('Disconnected, rebooting in 20 seconds')
            sleep(20)
            os.reboot()
        end
    end

    while true do
        process_websocket_message()
    end

end

--run loop
status, err = pcall(main)
--close websocket when loop breaks / errors
pcall(websocket.close)
if not status then
    print(string.format('Error: %s\nRebooting in 20 seconds', err))
    sleep(20)
    os.reboot()
end