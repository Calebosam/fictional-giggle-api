# Variables
K8S_DIR = ./ops/k8s

# Docker
build-image:
	docker build -t caleb9083/fictional-giggle-api .

start-container:
	docker run -p 4002:4000 --name api-giggle --env-file .env caleb9083/fictional-giggle-api 

stop-container:
	docker rm -f api-giggle

#########  
# K8S
#########

# Generate dockerhub credential secret
gen-dockerhub-creds:
	kubectl create secret docker-registry dockerhub-creds --docker-username=<username> --docker-password=<password> --docker-email=<email> --dry-run=client -o yaml -n fic-gig > $(K8S_DIR)/dockerhub-secrets.yml

# Namespace
ns-create:
	kubectl apply -f $(K8S_DIR)/ns.yml
ns-delete:
	kubectl apply -f $(K8S_DIR)/ns.yml

# dockerhub Secret
dockerhub-cred-create:
	kubectl apply -f $(K8S_DIR)/dockerhub-secrets.yml
dockerhub-cred-delete:
	kubectl delete -f $(K8S_DIR)/dockerhub-secrets.yml

# environment-file secret
env-create:
	kubectl apply -f $(K8S_DIR)/env-secret.yml
env-delete:
	kubectl delete -f $(K8S_DIR)/env-secret.yml

# Redis
redis-create:
	kubectl apply -f $(K8S_DIR)/redis.yml
redis-delete:
	kubectl apply -f $(K8S_DIR)/redis.yml

# app
app-create:
	kubectl apply -f $(K8S_DIR)/app.yml
app-delete:
	kubectl delete -f $(K8S_DIR)/app.yml

# Ingress
ingress-create:
	kubectl apply -f $(K8S_DIR)/app-ingress.yml
ingress-delete:
	kubectl delete -f $(K8S_DIR)/app-ingress.yml


# Resource Query
pods:
	kubectl get pods
svc:
	kubectl get service
secret:
	kubectl get secret
depl:
	kubectl get deployment
ing:
	kubectl get ingress
all:
	kubectl get all
