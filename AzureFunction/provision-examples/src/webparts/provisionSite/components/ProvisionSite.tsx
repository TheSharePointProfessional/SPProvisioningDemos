import * as React from 'react';
import styles from './ProvisionSite.module.scss';
import { IProvisionSiteProps } from './IProvisionSiteProps';
import { IProvisionSiteState } from './IProvisionSiteState';
import { escape } from '@microsoft/sp-lodash-subset';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import { AadHttpClient, HttpClient, HttpClientResponse, IHttpClientOptions } from "@microsoft/sp-http";

export default class ProvisionSite extends React.Component<IProvisionSiteProps, IProvisionSiteState> {
  constructor(props: IProvisionSiteProps) {
    super(props);

    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleAliasChange = this._handleAliasChange.bind(this);
    this._handlePublicChange = this._handlePublicChange.bind(this);

    this.state = {
      name: '',
      alias: '',
      public: false,
      status: ''
    };
  }

  private _handleNameChange(value:any): void {
    this.setState({ name: value });
  }
  private _handleAliasChange(value:any): void {
    this.setState({ alias: value });
  }
  private _handlePublicChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): void {
    this.setState({ public: isChecked });
  }

  private _handleCreateSite = (): void => {
    const aadHttpClient: AadHttpClient = new AadHttpClient(
      this.props.context.serviceScope,
      "ecac32fc-5d0a-41c3-bb39-8a728f48295a"
    );
  
    console.log("Created Aad httpClient");
    const aadRequestHeaders: Headers = new Headers();
    aadRequestHeaders.append('Accept', 'application/json');
    aadRequestHeaders.append('Content-Type', 'application/json;charset=UTF-8');
    
    //set up body that contains message to send to contract
    const body: string = JSON.stringify({
      "name":this.state.name,
      "alias":this.state.alias,
      "public":this.state.public
    });
  
    //set up the actual post options
    const requestPostOptions: IHttpClientOptions = {
      body: body,
      headers: aadRequestHeaders
    };
  
    console.log("Sending site creation request to AF");
    this.setState({ status: 'Sending request to create new site' });
    aadHttpClient
      .post(
        "https://pmdemoazurefunctionaad.azurewebsites.net/api/ApplyPnPProvisioningTemplateWebApi",
        HttpClient.configurations.v1,
        requestPostOptions
      )
      .then(response => {
        return response.json();
      })
      .then(json => {
        // Log the result in the console for testing purposes
        console.log("what was returned after posting a contract");
        console.log(json);
      })
      .catch(error => {
        console.error(error);
        //this.setState({ status: error });
        this.setState({status: "an error occurred"});
      });
  }

  public render(): React.ReactElement<IProvisionSiteProps> {
    return (
      <div className={ styles.provisionSite }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Create a new Team site</span>
              <p className={ styles.subTitle }>Provide team site information and the team site will be created</p>
              <TextField
                label="Team site name"
                value={this.state.name}
                onChanged={ this._handleNameChange }
                />
              <TextField
                label="Team site alias"
                value={this.state.alias}
                onChanged={ this._handleAliasChange }
                />
              <Checkbox
                label="Public site?"
                onChange={ this._handlePublicChange }
                />
              <DefaultButton
                primary={true}
                data-automation-id="test"
                text="Create the site"
                onClick={this._handleCreateSite}
              />

              <Label>{this.state.status}</Label>
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}
