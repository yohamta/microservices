# k8s commands memo

## create service

```
$ k apply -f posts-srv.yaml
```

## deploy latest image

```
$ k rollout restart deployment posts-depl
```

using glob

```
$ for f in `ls *.yaml`; do k rollout restart deployment ${f%.yaml}; done
```

apply all config

```
$ k apply -f .
```

## create deployment

```
$ k apply -f posts-srv.yaml
```

## get pods

```
$ k get pods
NAME                          READY   STATUS    RESTARTS   AGE
posts-depl-76df47848b-lwrh6   1/1     Running   0          7m22s
```

## get services

```
$ k get services
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          5d21h
posts-srv    NodePort    10.109.111.44   <none>        4000:30000/TCP   4m3s
```

## get logs

```
$ k logs posts-depl-76df47848b-lwrh6

> posts@1.0.0 start /app
> nodemon index.js

[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
v55
Listening on 4000
```

## delete all services, pods

```
$ k delete --all deployments,services
```

## start skaffold

```
$ skaffold dev
```

## Creating a secret which will be used by all Pod

```
$ k create secret generic jwt-secret --from-literal=jwt=asdf
```

Another example
```
$ k create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_dsfalkejfklasjef
secret/stripe-secret created
```

## Namespaces

```
$ k get namespaces
NAME              STATUS   AGE
default           Active   16d
docker            Active   16d
ingress-nginx     Active   3h32m
kube-node-lease   Active   16d
kube-public       Active   16d
kube-system       Active   16d

$ k get services -n ingress-nginx
NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.105.152.43    localhost     80:30786/TCP,443:31878/TCP   3h33m
ingress-nginx-controller-admission   ClusterIP      10.107.106.224   <none>        443/TCP                      3h33m

$ k describe service ingress-nginx-controller -n ingress-nginx
Name:                     ingress-nginx-controller
Namespace:                ingress-nginx
Labels:                   app.kubernetes.io/component=controller
                          app.kubernetes.io/instance=ingress-nginx
                          app.kubernetes.io/managed-by=Helm
                          app.kubernetes.io/name=ingress-nginx
                          app.kubernetes.io/version=0.33.0
                          helm.sh/chart=ingress-nginx-2.9.0
                          skaffold.dev/builder=local
                          skaffold.dev/cleanup=true
                          skaffold.dev/deployer=kubectl
                          skaffold.dev/docker-api-version=1.40
                          skaffold.dev/run-id=ddd4bc25-8f19-4c7b-8c83-0856541f4b37
                          skaffold.dev/tag-policy=git-commit
                          skaffold.dev/tail=true
Annotations:              kubectl.kubernetes.io/last-applied-configuration:
                            {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"app.kubernetes.io/component":"controller","app.kubernetes.io/i...
Selector:                 app.kubernetes.io/component=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx
Type:                     LoadBalancer
IP:                       10.105.152.43
LoadBalancer Ingress:     localhost
Port:                     http  80/TCP
TargetPort:               http/TCP
NodePort:                 http  30786/TCP
Endpoints:                10.1.2.50:80
Port:                     https  443/TCP
TargetPort:               https/TCP
NodePort:                 https  31878/TCP
Endpoints:                10.1.2.50:443
Session Affinity:         None
External Traffic Policy:  Local
HealthCheck NodePort:     32574
Events:                   <none>
```

## Port-forward to Pod

```
$ k get pods
NAME                                  READY   STATUS    RESTARTS   AGE
auth-depl-85b6bf566f-tntb5            1/1     Running   0          3m
auth-mongo-depl-f5bdb6c75-tqvbp       1/1     Running   0          3m
client-depl-66f8b8d7bb-7dp6z          1/1     Running   0          2m59s
nats-depl-6f6948fbb9-7rdvn            1/1     Running   0          2m59s
tickets-depl-5cbf5f7996-pvp24         1/1     Running   0          2m55s
tickets-mongo-depl-76fd7bfdf7-wn55m   1/1     Running   0          2m54s

$ k port-forward nats-depl-6f6948fbb9-7rdvn 4222:4222
```
