username=
token=
list_artifacts=https://api.github.com/repos/Bahmni-Covid19/ndhm-react/actions/artifacts

source /root/deployScripts/artifacts/ndhm-artifact

#Get artifact's download URL from the List artifact endpoint
artifact_id=$(curl "${list_artifacts}" | jq ".artifacts[0].id")
artifact_url=$(curl "${list_artifacts}" | jq ".artifacts[0].archive_download_url" | sed s/\"//g)


if [ "$PUBLISHED_HIP_ARTIFACTID" != "$artifact_id" ]
then
#Download the artifact
curl -L -o package_${artifact_id}.zip -u${username}:${token} ${artifact_url}

#Unzip new package
mkdir ./package_${artifact_id}
unzip -d ./package_${artifact_id} package_${artifact_id}.zip
unzip -d ./package_${artifact_id} ./package_${artifact_id}/ndhm-react.zip
rm -rf ./package_${artifact_id}/ndhm-react.zip
mv ./package_${artifact_id} ndhm
cp -rf ndhm/build /var/www/ndhm

#Giving ownership to ndhm
chown bahmni:bahmni /var/www/ndhm
chmod 777 /var/www/ndhm

# Cleanup
rm -f ./package_${artifact_id}.zip
rm -rf ./ndhm

echo "PUBLISHED_HIP_ARTIFACTID=${artifact_id}" > /root/deployScripts/artifacts/ndhm-artifact
else
echo "Artifaact didnt change"
fi
~
