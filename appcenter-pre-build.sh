fullPath="${APPCENTER_SOURCE_DIRECTORY}/phoenix/buildNumber"
echo "Using path"
echo $fullPath
buildNumber=$(cat $fullPath)
echo "got build number:"
echo $buildNumber
plutil -replace CFBundleVersion -string "${buildNumber}" $APPCENTER_SOURCE_DIRECTORY/phoenix/ios/phoenix/Info.plist
cat $APPCENTER_SOURCE_DIRECTORY/phoenix/ios/phoenix/Info.plist
