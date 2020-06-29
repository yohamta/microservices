# k8s config memo

## Pod
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
  type: ClusterIP # This is default value of type
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