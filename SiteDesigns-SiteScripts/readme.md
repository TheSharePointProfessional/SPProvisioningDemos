$credentials = Get-Credential
Connect-SPOService -Url https://"yourtenant"-admin.sharepoint.com -Credential $credentials

###Get all site scripts
Get-SPOSiteScript

###get one specific site script provides the content as well
$siteScript = Get-SPOSiteScript cc81a429-afb5-4225-b02c-02f3aa7c7578

###demo teamsite-script.json

###JSON Schema
###https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-design-json-schema
$script = @'
{
    "$schema": "schema.json", 
    "actions": [
      {
        "verb": "applyTheme", // action that applies a custom theme
        "themeName": "PixelMill Demo Primary"
      },
      {
        "verb": "setSiteLogo",
        "url": "https://pixelmilldev1.sharepoint.com/sites/cdn/Site%20Assets/pm-logo.png"
      },
      {
        verb: "setSiteExternalSharingCapability", 
        capability: "ExistingExternalUserSharingOnly" /* sharing only with existing external users in your directory */
      },
      {
        "verb": "createSiteColumn",
        "fieldType": "Text",
        "internalName": "siteColumn1Text",
        "displayName": "Project Status", 
        "isRequired": false,
        "group": "Contoso Custom",
        "enforceUnique": true
    },
    {
        "verb": "createSiteColumn",
        "fieldType": "Number",
        "internalName": "siteColumn2Number",
        "displayName": "Effort in Days",
        "isRequired": false
    },
    {
        "verb": "createSiteColumn",
        "fieldType": "Note",
        "internalName": "siteColumn3Note",
        "displayName": "Meeting Notes",
        "isRequired": false
    },
    {
        "verb": "createSiteColumn",
        "fieldType": "User",
        "internalName": "siteColumn4User",
        "displayName": "Project Owner",
        "isRequired": false
    },
    {
        "verb": "createContentType",
        "name": "Contoso Projects",
        "description": "custom list content type",
        "parentName": "Item",
        "hidden": false,
        "subactions":
        [
            {
                "verb": "addSiteColumn",
                "internalName": "siteColumn1Text"
            },
            {
                "verb": "addSiteColumn",
                "internalName": "siteColumn2Number"
            },
            {
                "verb": "addSiteColumn",
                "internalName": "siteColumn3Note"
            }
        ]
    },
    {
        "verb": "createSPList",
        "listName": "Documents",
        "templateType": 101,
        "subactions": 
        [
            {
                "verb": "setDescription",
                "description": "Custom document library to illustrate SharePoint site scripting capabilities - spring 2018"
            },
            {
                "verb": "addContentType",
                "name": "Contoso Projects"
            },
            {
                "verb": "addSiteColumn",
                "internalName": "siteColumn4User",
                "addToDefaultView": true
            },
            {
                "verb": "addSPField",
                "fieldType": "DateTime",
                "displayName": "Delivery Date",
                "internalName": "spField1DateTime",
                "isRequired": true,
                "addToDefaultView": true
            },
            {
                "verb": "addSPView",
                "name": "Contoso Projects by Effort",
                "viewFields": 
                [
                    "ID", 
                    "Title",
                    "siteColumn1Text",
                    "siteColumn2Number",
                    "siteColumn3Note",
                    "siteColumn4User",
                    "spField1DateTime"
                ],
                "query": "<OrderBy><FieldRef Name=\"Title\" /><FieldRef Name=\"siteColumn1Text\" Ascending=\"FALSE\" /></OrderBy><Where><Gt><FieldRef Name=\"siteColumn2Number\"/><Value Type=\"Number\">5</Value></Gt></Where>",
                "rowLimit": 100,
                "isPaged": true,
                "makeDefault": true
            }
        ]
      },
      {
        "verb": "installSolution",
        "id": "c525399e-6c19-46ed-a46c-0cbbd6b932cb"
      },
      {
          "verb": "associateExtension", // action that registers the extension
          "title": "overview-client-side-solution", // run Get-PnPApp for a list of all apps with their Names
          "location": "ClientSideExtension.ApplicationCustomizer", // type of extension
          "clientSideComponentId": "7e60d767-ce10-47c3-adfc-6d3a2d08537f", // ID from sharepoint/assets/elements.xml
          "scope": "Site" // web | site
      }
    ],
    "version": 1
  }
'@

###Add this site script
$siteScript = Add-SPOSiteScript -Title "Provision Test Site Script" -Content $script -Description "Provision Team Site Script Description"

Get-SPOSiteScript $siteScript.Id
Remove-SPOSiteScript $siteScript.Id


###get existing custom site designs
Get-SPOSiteDesign f46e08a1-3e30-439e-b76c-9cb28f709aad

###64 == team, 68 == comm
###Add-SPOSiteDesign -Title "Custom Team Site Design" -WebTemplate "64" -Description "A custom team site design" -SiteScripts $siteScript.Id -PreviewImageUrl "https://pixelmilldev1.sharepoint.com/sites/cdn/Site%20Assets/pm-portfoliosite.png"
$siteDesign = Add-SPOSiteDesign -Title "Provision Team Site Design Demo" -WebTemplate "64" -SiteScripts $siteScript.Id -Description "A team site provisioning site design demo" -PreviewImageUrl "https://pixelmilldev1.sharepoint.com/sites/cdn/Site%20Assets/pm-teamsite.png"

Get-SPOSiteDesign
Remove-SPOSiteDesign $siteDesign.Id