# Comando para listar contenedores

docker container ls # <agrega -a para listar todos>
docker container run -p 666:80 docker/getting-started
docker container run -d -p 666:80 docker/getting-started

docker container stop 36a1c2 #parar el container <36a1c2>es el ID del container
docker container rm -f 36a1c2 # se borra de golpe
docker container prune #borra todos los container apagados 
