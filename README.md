# Overthrown

## Install aws cli and lightsail plugins:

https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-install-software

## Building/Deploying to lightsail

```bash
docker build . -t overthrown:1.0.0
```

```bash
aws lightsail push-container-image --region us-west-2 --service-name overthrown --label overthrown --image overthrown:1.0.0
```

Then we manage the deployment via the web interface (Basically just selected the uploaded image and opened port 3000)
