SERVER_URL = '' --empty cuz template

if not os.getComputerLabel() then os.setComputerLabel('tutel #' .. os.getComputerID()) end
shell.run(string.format('wget run %sremotetutel.lua', SERVER_URL))
print('Failed to fetch program from server, rebooting in 20 seconds.')
sleep(20)
os.reboot()