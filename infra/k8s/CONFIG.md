# k8s config memo

## Pod
- https://cloud.google.com/kubernetes-engine/docs/concepts/pod
- The smallest, most basic deployable objects in Kubernetes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: posts
spec:
  containers:
    - name: posts
      image: yohamta/posts

```

## Deployment
- https://cloud.google.com/kubernetes-engine/docs/concepts/deployment
- Deployment (1) -> (*) Replicated Pods
- You can describe a desired state in a deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: yohamta/posts
```

## Service
- Service is a abstrac way to expose an application running on a set of Pods as a network service
- https://kubernetes.io/docs/concepts/services-networking/service/
- define logical set of Pods
  The set of pods targeted by Service is usually determined by a selector

### Cluster IP Service
- easy-to-remember URL
- Needed for each Pod

Ex:
```
Posts -> Pod -> Cluster IP Service -> Pod -> Event Bus
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-bus-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: event-bus
  template:
    metadata:
      labels:
        app: event-bus
    spec:
      containers:
        - name: event-bus
          image: yohamta/event-bus
---
apiVersion: v1
kind: Service
metadata:
  name: event-bus-srv
spec:
  selector:
    app: event-bus
  # type: ClusterIP # This is default value of type
  ports:
    - name: event-bus
      protocol: TCP
      port: 4005
      targetPort: 4005

```

```
$ k get services
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
event-bus-srv   ClusterIP   10.98.95.49     <none>        4005/TCP         9s
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP          5d22h
posts-srv       NodePort    10.109.111.44   <none>        4000:30000/TCP   41m
```

### Load Balancer Service
- Load Balancer is a thing to Route/Foward requests to appropriate pods
- Load Balancer Service tells the Cluster to reach out to its Provider(Cloud) and provision a LoadBalancer
- Load Balancer Service -> Cluster -> Cloud Provider -> provision a Load Balancer

## NodePort Service
- Host -> [nodePort] Node -> [port] Node Port  -> [targetPort] pod

```yaml
apiVersion: v1
kind: Service
metadata:
  name: posts-srv
spec:
  type: NodePort
  selector:
    app: posts
  ports:
  - name: posts
    protocol: TCP
    port: 4000
    targetPort: 4000
    nodePort: 30000
```

## Ingress / Ingress Controller
- A pod with a set of routing rules to distribute to other services
- Work along side with Load Balancer
- Client -> Load Balancer -> Ingress Controller[Routing based on the path] -> Cluster IP -> Pods

```
$ k get pods --namespace ingress-nginx
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-75pwz        0/1     Completed   0          7m31s
ingress-nginx-admission-patch-rrh9l         0/1     Completed   0          7m31s
ingress-nginx-controller-579fddb54f-wj4w6   1/1     Running     0          7m41s

$ k get service --namespace ingress-nginx
NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.107.189.215   localhost     80:31808/TCP,443:30481/TCP   7m49s
ingress-nginx-controller-admission   ClusterIP      10.98.197.241    <none>        443/TCP                      7m49s
```

### Routing rule for Ingress Controller

ingress-srv.yaml
```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  rules:
    - host: posts.com
      http:
        paths:
          - path: /posts/create
            backend:
              serviceName: posts-clusterip-srv
              servicePort: 4000
          - path: /posts
            backend:
              serviceName: query-srv
              servicePort: 4002
          - path: /posts/?(.*)/comments
            backend:
              serviceName: comments-srv
              servicePort: 4001
          - path: /
            backend:
              serviceName: client-srv
              servicePort: 3000
```

```
$ k get Ingress
NAME          HOSTS       ADDRESS     PORTS   AGE
ingress-srv   posts.com   localhost   80      10s
```