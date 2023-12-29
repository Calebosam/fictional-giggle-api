build-image:
	docker build -t caleb9083/fictional-giggle-api .

start-container:
	docker run -p 4002:4000 --name api-giggle --env-file .env caleb9083/fictional-giggle-api 

stop-container:
	docker rm -f api-giggle