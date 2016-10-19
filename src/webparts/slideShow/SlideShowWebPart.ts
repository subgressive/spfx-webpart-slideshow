import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-client-preview';

import styles from './SlideShow.module.scss';
import * as strings from 'slideShowStrings';
import { ISlideShowWebPartProps } from './ISlideShowWebPartProps';
import MockHttpClient from './MockHttpClient';
import { EnvironmentType } from '@microsoft/sp-client-base';
import * as myjQuery from 'jquery';
require('jquery-cycle');

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
  EncodedAbsUrl: string;
}

export default class SlideShowWebPart extends BaseClientSideWebPart<ISlideShowWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.slideShow}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Schrodingers Cat</span>
              <p class="ms-font-l ms-fontColor-white">${this.properties.description}</p>
              <p class="ms-font-l ms-fontColor-white">${this.properties.dropdown}</p>
            </div>
          </div>
        </div>
        <div id="spListContainer" />
        </div>
      </div>`;

      this._renderListAsync();
   }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
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
              label: 'Description'
            }),
            PropertyPaneTextField('multitext', {
              label: 'Multi-line Text Field',
              multiline: true
            }),
            PropertyPaneCheckbox('checkbox', {
              text: 'Checkbox'
            }),
            PropertyPaneDropdown('dropdown', {
              label: 'Dropdown',
              options: [
                { key: 'The Jag Lives :)', text: 'Lives' },
                { key: 'The Jag is Dead :(', text: 'Dies' }
              ]}),
            PropertyPaneToggle('toggle', {
              label: 'Toggle',
              onText: 'On',
              offText: 'Off'
            })
          ]
          }
        ]
      }
    ]
  };
}

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl)
        .then((data: ISPList[]) => {
             var listData: ISPLists = { value: data };
             return listData;
         }) as Promise<ISPLists>;
  }

  private _getListData(): Promise<ISPLists> {
  return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('jagpics')/Items?$select=Title,Id,EncodedAbsUrl&$orderby=Title asc")
        .then((response: Response) => {
        return response.json();
        });
  }

  private _renderListAsync(): void {
    // Local environment
    if (this.context.environment.type === EnvironmentType.Local) {
        this._getMockListData().then((response) => {
        this._renderList(response.value);
        });
        }
        else {
        this._getListData()
        .then((response) => {
            this._renderList(response.value);
        });
    }
  }

  private _renderList(items: ISPList[]): void {
    let html: string = '';
    items.forEach((item: ISPList) => {
        //html += `
        //<ul class="${styles.list}">
        //    <li class="${styles.listItem}">
        //        <span class="ms-font-l">${item.Title}</span>
        //    </li>
        //</ul>`;
        html += `<img src="${item.EncodedAbsUrl}" class="${styles.responsiveImage}" alt="image" />`;
    });

    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
    myjQuery( document ).ready(function() {
      myjQuery('#spListContainer').cycle();
    });
  }
}