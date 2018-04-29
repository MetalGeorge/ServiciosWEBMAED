# ServiciosWEBMAED

Grupo Jo Ra Ca

Integrantes:

JOrge Escobar

RAúl Vargas

CArlos Montellano
==================================
Crear Reverse proxy
	- nGINX y configurarlo
	
API Gateway REST
	- Un servicio por cada servicio interno
		- Hace la redirección.

ideas
	- Servicio (Todo con logs)
		- Métodos
			- Crear idea
			- Borra idea
			- Hacer voto
			- Deshacer voto 
			- Listar ideas
		- Mandar a la cola (envia)
			- Actualizar los votos (con el servicio estadísticas)
		- suscribir a la cola (recibe)
			- Para borrar ideas de un usuario (de servicio usuario)
	- Base de datos Ideas
		- MySQL
usuarios
	- Servicio (Todo con logs)
		-Métodos
			- Crear el usuario
			- borrar el usuario
			- Autenticar usuarios
		- Mandar a la cola
			- Cuando se elimine un usuario (para borrar ideas y votos) (servicio ideas)
		- NO Suscribir a la cola  (parece que no se suscribe)
			
	- Base de datos Ideas
		- MySQL

Estadisticas
	(NOTA: al parecer el servicio no tiene relación con la base users y servicio users)
	- Servicio (Todo con logs)
		- Suscribir a la cola
			- Actualizar los votos por idea
	- Base de datos 
		- MySQL(usa la de ideas)

Monitoring
	- Sobre los logs

Instalar y configurar rabbitMQ
	
===================
Tecnologías:
	- Nodejs
	- Express
	- MySQL
	- rabbitMQ
	
==============
Código
	- uIdeas
	- uUsuarios
	- uApiGateway
	- uStats
	- mq
