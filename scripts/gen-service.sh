#/bin/bash
if [[ -f $1 ]];then
  json=$1
else
  json=swagger.api.json
  curl $1 > $json
fi
rm -rf src/services
java -jar scripts/swagger-codegen-cli.jar generate \
-i $json \
-l typescript-angularjs -o src/services -t scripts/typescript-tkit/
if [[ ! -f $1 ]];then
rm $json
fi
rm src/services/api.module.ts
files=`find src/services -name "*.ts"`
for file in $files;do
  node -e "require('fs').writeFileSync('$file', require('fs').readFileSync('$file', {encoding: 'utf8'}).replace('extends null<String', 'extends Map<string').replace(/Array([^<])/g, (all, x) => ('Array<any>' + x)), {encoding: 'utf8'})"
done
./node_modules/.bin/prettier src/services/**.ts src/services/**/**.ts --write