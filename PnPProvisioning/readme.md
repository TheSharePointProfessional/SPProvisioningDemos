#demo - PnP Provisioning

Connect-PnPOnline -url https://pixelmilldev1.sharepoint.com/ -Credential $credentials

###Create a new Team site
New-PnPSite -Type TeamSite -Title "Provisioned Demo Team Site PS" -Alias PS-Demo-Team-Site -IsPublic

###Install an app from tenant app catalog
Connect-PnPOnline -url https://pixelmilldev1.sharepoint.com/sites/PS-Demo-Team-Site -Credential $credentials
Install-PnPApp -Identity c525399e-6c19-46ed-a46c-0cbbd6b932cb

###review provisioning template
Provision.Template.xml

###Apply provisioning template to team site
Apply-PnPProvisioningTemplate -Path .\Provision.Template.xml

###Apply site design to team site
Get-PnPSiteDesign | ?{$_.Title -eq "Provision Team Site Design Demo"} | Invoke-PnPSiteDesign

