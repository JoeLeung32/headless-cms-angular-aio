import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ReplaySubject } from 'rxjs'
import { take } from 'rxjs/operators'
import * as moment from 'moment'

@Injectable({
    providedIn: 'root',
})
export class I18nService {
    language$ = new ReplaySubject<LangChangeEvent>(1)
    translate = this.translateService
    urlHasLang = false
    urlLangCode = ''
    urlPathname = ''
    urlSearch:
        | {
              [key: string]: string
          }
        | undefined
    basicTitleArray = ['webTitle']

    constructor(
        private translateService: TranslateService,
        private router: Router,
        private title: Title
    ) {
        this.translateService.onLangChange.subscribe(() => {
            this.setPageTitle()
        })
    }

    initial(): void {
        const browserLang = this.translateService.getBrowserCultureLang()
        this.translateService.addLangs(['en', 'tc', 'sc'])
        this.detectUrlLang()
        if (this.urlHasLang) {
            this.setLang(this.urlLangCode)
        } else {
            switch (!!browserLang) {
                case ['zh-CN', 'zh-SG'].includes(<string>browserLang): {
                    this.setUrlLang('sc')
                    break
                }
                case ['zh-HK', 'zh-TW', 'zh'].includes(<string>browserLang): {
                    this.setUrlLang('tc')
                    break
                }
                default: {
                    this.setUrlLang('en')
                    break
                }
            }
        }
    }

    resetPageTitle(): void {
        this.basicTitleArray = ['webTitle']
        this.setPageTitle()
    }

    dateTime(datetime: string, format?: string): string {
        if (!format) {
            format = 'LT'
        }
        const time = moment(datetime)
        if (this.translate.currentLang === 'tc') {
            return time.locale('zh-tw').format(format)
        } else if (this.translate.currentLang === 'sc') {
            return time.locale('zh-cn').format(format)
        }
        return time.locale('en-au').format(format)
    }

    private setLang(lang: string): void {
        this.translateService.onLangChange.pipe(take(1)).subscribe((result) => {
            this.language$.next(result)
        })
        this.translateService.use(lang)
    }

    private setUrlLang(lang: string): void {
        let navigateCommands = [lang]
        this.translateService.onLangChange.pipe(take(1)).subscribe((result) => {
            this.language$.next(result)
        })
        this.translateService.use(lang)
        this.detectUrlLang()
        if (this.urlPathname && this.urlPathname.toString().length) {
            navigateCommands = [lang, ...this.urlPathname.split('/')]
        }
        this.router
            .navigate(navigateCommands, {
                queryParams: this.urlSearch,
                replaceUrl: true,
            })
            .then((r) => r)
    }

    private detectUrlLang(): void {
        const { pathname, search } = window.location
        this.urlHasLang = pathname.search(/^\/(en|tc|sc)/) === 0
        this.urlLangCode = pathname.substr(1, 2)
        this.urlPathname = decodeURIComponent(pathname.substr(4))
        if (search && search.toString().length) {
            search
                .toString()
                .substr(1)
                .split('&')
                .forEach((param) => {
                    const [key, value] = param.split('=')
                    if (this.urlSearch) {
                        this.urlSearch[key] = value
                    }
                })
        }
    }

    private setPageTitle(arr?: Array<string>): void {
        let titleArray = []
        if (arr && arr.length) {
            arr.forEach((code) => {
                this.basicTitleArray.push(code)
            })
        }
        titleArray = Array.from(new Set(this.basicTitleArray))
        if (titleArray && titleArray.length) {
            titleArray.forEach((code, idx) => {
                titleArray[idx] = this.translateService.instant(code)
            })
        }
        this.title.setTitle(titleArray.reverse().join(' - '))
    }
}
