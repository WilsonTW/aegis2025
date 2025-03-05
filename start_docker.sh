#!/bin/sh
# sudo docker service ls 看到的NAME的前綴是這邊決定的
# 表示stack NAME
docker stack deploy -c docker-compose.yml aegis
