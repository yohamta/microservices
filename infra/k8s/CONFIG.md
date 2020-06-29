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

## NodePort Service
Host -> [nodePort] Master -> [port] Node Port  -> [targetPort] pod

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