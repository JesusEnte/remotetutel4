SERVER_URL = '' -- empty cuz template

shell.run(string.format('wget run http://%s/remotetutel.lua', SERVER_URL))
print('Failed to fetch program from server, rebooting in 20 seconds.')
sleep(20)
os.reboot()