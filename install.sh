apt update -y && apt upgrade -y
apt update     
apt install git tsu -y
cd /data
sudo rm -rf VPN
sudo git clone -b VPN https://github.com/Qiu2zhi1zhe3/VPN
sudo chmod -R 755 VPN
sudo mkdir -p /data/adb/modules/VPN/system/bin/
sudo ln -sf /data/VPN/start.sh /data/adb/modules/VPN/system/bin/vpn
su -c 'cat << EOF >> /data/adb/modules/VPN/service.sh
#!/system/bin/sh
until [[ \$(getprop sys.boot_completed) -eq 1 ]] ; do
sleep 3
done
busybox_path="/data/adb/magisk/busybox"
VPN="/data/VPN"
\${VPN}/start.sh singbox
EOF'
echo && read -p "  Vui lòng nhập link subscribe: " link
if [[ $link != "" ]] ;  then
su -c sed -i "s+link\ sub+$link+g" /data/VPN/config.yaml
su -c sed -i "s+link\ sub+$link+g" /data/VPN/config.json
sudo curl -sL $link -o /data/VPN/run/sub.txt
fi
echo ' Hãy gõ lệnh "su" và "vpn" để truy cập vào menu sau khi khởi động lại '
