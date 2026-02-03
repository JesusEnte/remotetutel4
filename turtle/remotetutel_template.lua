SERVER_URL = '' --empty cuz template

--pretty terminal
term.clear()
term.setCursorPos(1,1)
print(string.format('#%d: %s\n\n', os.computerID(), os.computerLabel()))


websocket_url = string.format('%sws/turtles', SERVER_URL)
websocket = nil

status, err = pcall(function()

    --websocket connection
    websocket, err = http.websocket(websocket_url)
    if err then
        print(string.format('Couldn\'t connect to %s, retrying in 20 seconds\nError: %s', websocket_url, err))
        sleep(20)
        os.reboot()
    end

    --authentication
    websocket.send(textutils.serialiseJSON({type='authentication', id=tostring(os.computerID())}))


    while true do

        --receive and unserialise
        msg = websocket.receive()
        if msg == nil then
            print('Server closed connection, rebooting in 20 seconds')
            sleep(20)
            os.reboot()
        end
        msg = textutils.unserialiseJSON(msg)

        --check essentials
        if not msg.type or msg.type ~= 'eval' then return end 
        if not msg.code then return end
            
        --eval code
        func = load(msg.code)
        result = {pcall(func)}

        --message on eval error
        if not result[1] then
            websocket.send(textutils.serialiseJSON({type='eval', error=result[2]}))
            return
        end

        --jsonify actual data
        json_result = {pcall(function() return textutils.serialiseJSON({type='eval', data={table.unpack(result, 2, #result)}}) end)}

        --message on json error
        if not json_result[1] then
            websocket.send(textutils.serialiseJSON({type='eval', error="JSON Error:" .. json_result[2]}))
            return
        end

        --message when everything went right
        websocket.send(json_result[2])
        return
    
    end

end)

--reboot on error
if not status then
    print(string.format('Error: %s\nRebooting in 20 seconds', err))
    sleep(20)
    os.reboot()
end