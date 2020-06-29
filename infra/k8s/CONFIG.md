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

## Cluster IP
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

## Load Balancer


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