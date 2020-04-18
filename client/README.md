# client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### deployment to google cloud platform 
vue
```
gsutil rsync -d -r gs://webapp-vue-share ./

gcloud app deploy app.yaml
```

graphql api
```
gcloud app deploy api.yaml
```