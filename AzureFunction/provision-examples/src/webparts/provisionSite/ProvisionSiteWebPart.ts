import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ProvisionSiteWebPartStrings';
import ProvisionSite from './components/ProvisionSite';
import { IProvisionSiteProps } from './components/IProvisionSiteProps';

export interface IProvisionSiteWebPartProps {
  description: string;
}

export default class ProvisionSiteWebPart extends BaseClientSideWebPart<IProvisionSiteWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProvisionSiteProps > = React.createElement(
      ProvisionSite,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
