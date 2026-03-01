# How to run

1. npm install
2. npx cdk bootstrap
3. npx cdk deploy

# Knowledge base

- "new lambda.function" nefunguje dobře s typescriptem. Nejspíš proto, že v sobě nemá kompilátor. Lepší je použít "new NodejsFunction".
