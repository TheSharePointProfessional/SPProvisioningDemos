#Site designs with flow

#flow
https://emea.flow.microsoft.com/en-us/
#Storage Account
pmdev1testprovqueue1
#Azure function
pmdev1testprovqueue1 - ApplyPnPProvisioningTemplate


$scriptFlow = @'
{
    "$schema": "schema.json", 
    "actions": [
        {
            "verb": "triggerFlow",
            "url": "https://prod-20.westus.logic.azure.com:443/workflows/a41c66069fc44dda8dd510d99ed0f564/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AXt0H4HL93SLtJchQpqU05gWaXvduM6tOTm6Rplhvrs",
            "name": "Record and queue site creation event",
            "parameters": {
                "event": "Microsoft Event",
                "product": "SharePoint"
            }
        }
    ],
    "version": 1
}
'@

$siteScriptFlow = Add-SPOSiteScript -Title "Custom Test Site Script wFlow" -Content $scriptFlow -Description "Custom Team Site Script with Flow Description"

$siteDesignFlow = Add-SPOSiteDesign -Title "Custom Team Site Design wFlow" -WebTemplate "64" -SiteScripts $siteScriptFlow.Id -Description "A custom team site design" -PreviewImageUrl "https://pixelmilldev1.sharepoint.com/sites/cdn/Site%20Assets/pm-portfoliosite.png"

###Create new team site and should be homepnp.aspx added to site pages library
###Create a new team site using Custom Test Site Script wFlow
https://pixelmilldev1.sharepoint.com/_layouts/15/sharepoint.aspx

#watch process