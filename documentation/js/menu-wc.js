'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">aegis documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AIQueryModule.html" data-type="entity-link" >AIQueryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' : 'data-bs-target="#xs-controllers-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' :
                                            'id="xs-controllers-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' }>
                                            <li class="link">
                                                <a href="controllers/AIQueryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AIQueryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' : 'data-bs-target="#xs-injectables-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' :
                                        'id="xs-injectables-links-module-AIQueryModule-a0b000681b04aa50e0a06cba92b3c10963b1543808eace81d20abf8e7797467892bc5b1ebf787f389702d31c957af30e11326297e8cb33e250227a70ee240e79"' }>
                                        <li class="link">
                                            <a href="injectables/AIQueryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AIQueryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceTypeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceTypeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DomainService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DomainService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' : 'data-bs-target="#xs-controllers-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' :
                                            'id="xs-controllers-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceConnectionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceConnectionController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceDataController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceDataController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceDataExController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceDataExController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceInputController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceInputController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceOutputController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceOutputController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceTypeCategoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceTypeCategoryController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeviceTypeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceTypeController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DomainController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DomainController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/EventController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MailController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PagePermissionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PagePermissionController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PowerSchedulerController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PowerSchedulerController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RepairItemController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairItemController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RepairOrderController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairOrderController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RepairOrderHistoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairOrderHistoryController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RepairRecordController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairRecordController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RepairTypeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairTypeController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RepairUserRecordController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairUserRecordController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/RoleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/SchedulerController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SchedulerController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/SettingController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' : 'data-bs-target="#xs-injectables-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' :
                                        'id="xs-injectables-links-module-AppModule-60babeee6eba44b9269c44b17e8c5aad7e3a96d112ed76b5f774dc469e6af635c498983ae809ba1eb5ea23db3cca44414756be23017d805b6d5657d58c157cb1"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AutoRunService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AutoRunService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DataStorerManager.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataStorerManager</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceConnectionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceConnectionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceDataPredictionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceDataPredictionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceDataService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceDataService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceInputService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceInputService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceOutputService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceOutputService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceReportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceReportService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceTypeCategoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceTypeCategoryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceTypeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceTypeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DomainService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DomainService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/InfluxdbClientService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InfluxdbClientService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PagePermissionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PagePermissionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PowerSchedulerExService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PowerSchedulerExService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PowerSchedulerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PowerSchedulerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepairItemService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairItemService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepairOrderHistoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairOrderHistoryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepairOrderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairOrderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepairRecordService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairRecordService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepairTypeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairTypeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepairUserRecordService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairUserRecordService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SchedulerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SchedulerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SettingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' :
                                            'id="xs-controllers-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' :
                                        'id="xs-injectables-links-module-AuthModule-cd52ef0c7a22b329e5151deff6dda6aa1ed7a3b9917e02e5e4216a1e9ca716398712210e54d7c11b8c92bf63cceb056eb0c74992bb145c1a106200436c0a658b"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DomainService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DomainService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PagePermissionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PagePermissionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' :
                                            'id="xs-controllers-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' :
                                        'id="xs-injectables-links-module-AuthModule-d88e9000bcc41630a8fa127bc2d154cb82947c0b35886a35979ec3664ca84f6088bc137442adddf1c60eb9705f3bea69ec41ba472e514a191194e7bbbbddd702-1"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DataStorerManagerModule.html" data-type="entity-link" >DataStorerManagerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceConnectionModule.html" data-type="entity-link" >DeviceConnectionModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceDataModule.html" data-type="entity-link" >DeviceDataModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceInputModule.html" data-type="entity-link" >DeviceInputModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceMeterModule.html" data-type="entity-link" >DeviceMeterModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceModule.html" data-type="entity-link" >DeviceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceOutputModule.html" data-type="entity-link" >DeviceOutputModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceTypeCategoryModule.html" data-type="entity-link" >DeviceTypeCategoryModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DeviceTypeModule.html" data-type="entity-link" >DeviceTypeModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DomainModule.html" data-type="entity-link" >DomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EventModule.html" data-type="entity-link" >EventModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ExtraModule.html" data-type="entity-link" >ExtraModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ExtraModule-331fff07de7d06925be23ee5e671ef11662b793f8f4d20c2ee7e344bdd3c35b55272f6efd90cebc077ce9709e81d640bef27a64b0c7b2d0cbacd4f6615b33e79"' : 'data-bs-target="#xs-controllers-links-module-ExtraModule-331fff07de7d06925be23ee5e671ef11662b793f8f4d20c2ee7e344bdd3c35b55272f6efd90cebc077ce9709e81d640bef27a64b0c7b2d0cbacd4f6615b33e79"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExtraModule-331fff07de7d06925be23ee5e671ef11662b793f8f4d20c2ee7e344bdd3c35b55272f6efd90cebc077ce9709e81d640bef27a64b0c7b2d0cbacd4f6615b33e79"' :
                                            'id="xs-controllers-links-module-ExtraModule-331fff07de7d06925be23ee5e671ef11662b793f8f4d20c2ee7e344bdd3c35b55272f6efd90cebc077ce9709e81d640bef27a64b0c7b2d0cbacd4f6615b33e79"' }>
                                            <li class="link">
                                                <a href="controllers/ExtraController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExtraController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PagePermissionModule.html" data-type="entity-link" >PagePermissionModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PowerSchedulerModule.html" data-type="entity-link" >PowerSchedulerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RepairItemModule.html" data-type="entity-link" >RepairItemModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RepairOrderHistoryModule.html" data-type="entity-link" >RepairOrderHistoryModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RepairOrderModule.html" data-type="entity-link" >RepairOrderModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RepairRecordModule.html" data-type="entity-link" >RepairRecordModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RepairTypeModule.html" data-type="entity-link" >RepairTypeModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RepairUserRecordModule.html" data-type="entity-link" >RepairUserRecordModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RoleModule.html" data-type="entity-link" >RoleModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SchedulerModule.html" data-type="entity-link" >SchedulerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SettingModule.html" data-type="entity-link" >SettingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' : 'data-bs-target="#xs-controllers-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' :
                                            'id="xs-controllers-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' : 'data-bs-target="#xs-injectables-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' :
                                        'id="xs-injectables-links-module-UserModule-621ed01b2ff3920264a4c23af0da0609eea38006bde9877df709eca098ad04202e60686250944d2582dd2581d94de5fe0329ad7ffd15cca61a38e92d423cd8cc-1"' }>
                                        <li class="link">
                                            <a href="injectables/RepairOrderHistoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairOrderHistoryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepairUserRecordService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepairUserRecordService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/DeviceConnectionControllerBase.html" data-type="entity-link" >DeviceConnectionControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeviceControllerBase.html" data-type="entity-link" >DeviceControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeviceInputControllerBase.html" data-type="entity-link" >DeviceInputControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeviceMeterController.html" data-type="entity-link" >DeviceMeterController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeviceMeterControllerBase.html" data-type="entity-link" >DeviceMeterControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeviceOutputControllerBase.html" data-type="entity-link" >DeviceOutputControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeviceTypeCategoryControllerBase.html" data-type="entity-link" >DeviceTypeCategoryControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeviceTypeControllerBase.html" data-type="entity-link" >DeviceTypeControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DomainControllerBase.html" data-type="entity-link" >DomainControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EventControllerBase.html" data-type="entity-link" >EventControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MailControllerBase.html" data-type="entity-link" >MailControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PagePermissionControllerBase.html" data-type="entity-link" >PagePermissionControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PowerSchedulerControllerBase.html" data-type="entity-link" >PowerSchedulerControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RepairItemControllerBase.html" data-type="entity-link" >RepairItemControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RepairOrderControllerBase.html" data-type="entity-link" >RepairOrderControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RepairOrderHistoryControllerBase.html" data-type="entity-link" >RepairOrderHistoryControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RepairRecordControllerBase.html" data-type="entity-link" >RepairRecordControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RepairTypeControllerBase.html" data-type="entity-link" >RepairTypeControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RepairUserRecordControllerBase.html" data-type="entity-link" >RepairUserRecordControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RoleControllerBase.html" data-type="entity-link" >RoleControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SchedulerControllerBase.html" data-type="entity-link" >SchedulerControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SettingControllerBase.html" data-type="entity-link" >SettingControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserControllerBase.html" data-type="entity-link" >UserControllerBase</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserControllerBase-1.html" data-type="entity-link" >UserControllerBase</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Device.html" data-type="entity-link" >Device</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceConnection.html" data-type="entity-link" >DeviceConnection</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceConnectionGet.html" data-type="entity-link" >DeviceConnectionGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceGet.html" data-type="entity-link" >DeviceGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceInput.html" data-type="entity-link" >DeviceInput</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceInputGet.html" data-type="entity-link" >DeviceInputGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceMeter.html" data-type="entity-link" >DeviceMeter</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceMeterGet.html" data-type="entity-link" >DeviceMeterGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceOutput.html" data-type="entity-link" >DeviceOutput</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceOutputGet.html" data-type="entity-link" >DeviceOutputGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceType.html" data-type="entity-link" >DeviceType</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceTypeCategory.html" data-type="entity-link" >DeviceTypeCategory</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceTypeCategoryGet.html" data-type="entity-link" >DeviceTypeCategoryGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceTypeGet.html" data-type="entity-link" >DeviceTypeGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceTypeTriggerArg.html" data-type="entity-link" >DeviceTypeTriggerArg</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Domain.html" data-type="entity-link" >Domain</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DomainGet.html" data-type="entity-link" >DomainGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Event.html" data-type="entity-link" >Event</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EventGet.html" data-type="entity-link" >EventGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Mail.html" data-type="entity-link" >Mail</a>
                                </li>
                                <li class="link">
                                    <a href="entities/MailGet.html" data-type="entity-link" >MailGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PagePermission.html" data-type="entity-link" >PagePermission</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PagePermissionGet.html" data-type="entity-link" >PagePermissionGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PowerScheduler.html" data-type="entity-link" >PowerScheduler</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PowerSchedulerGet.html" data-type="entity-link" >PowerSchedulerGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairItem.html" data-type="entity-link" >RepairItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairItemGet.html" data-type="entity-link" >RepairItemGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairOrder.html" data-type="entity-link" >RepairOrder</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairOrderGet.html" data-type="entity-link" >RepairOrderGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairOrderHistory.html" data-type="entity-link" >RepairOrderHistory</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairOrderHistoryGet.html" data-type="entity-link" >RepairOrderHistoryGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairRecord.html" data-type="entity-link" >RepairRecord</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairRecordGet.html" data-type="entity-link" >RepairRecordGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairType.html" data-type="entity-link" >RepairType</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairTypeGet.html" data-type="entity-link" >RepairTypeGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairUserRecord.html" data-type="entity-link" >RepairUserRecord</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepairUserRecordGet.html" data-type="entity-link" >RepairUserRecordGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Role.html" data-type="entity-link" >Role</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RoleGet.html" data-type="entity-link" >RoleGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Scheduler.html" data-type="entity-link" >Scheduler</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SchedulerGet.html" data-type="entity-link" >SchedulerGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Setting.html" data-type="entity-link" >Setting</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SettingGet.html" data-type="entity-link" >SettingGet</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User-1.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserGet.html" data-type="entity-link" >UserGet</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link" >AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppConfigService.html" data-type="entity-link" >AppConfigService</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthLogin.html" data-type="entity-link" >AuthLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthLogin-1.html" data-type="entity-link" >AuthLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver.html" data-type="entity-link" >AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver-1.html" data-type="entity-link" >AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DarkBox.html" data-type="entity-link" >DarkBox</a>
                            </li>
                            <li class="link">
                                <a href="classes/Device.html" data-type="entity-link" >Device</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceClient.html" data-type="entity-link" >DeviceClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceConnection.html" data-type="entity-link" >DeviceConnection</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceConnectionGet.html" data-type="entity-link" >DeviceConnectionGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceConnectionsResolver.html" data-type="entity-link" >DeviceConnectionsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceConnectionsResolverBase.html" data-type="entity-link" >DeviceConnectionsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceConnectionUpdate.html" data-type="entity-link" >DeviceConnectionUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceGet.html" data-type="entity-link" >DeviceGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceInput.html" data-type="entity-link" >DeviceInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceInputGet.html" data-type="entity-link" >DeviceInputGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceInputsResolver.html" data-type="entity-link" >DeviceInputsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceInputsResolverBase.html" data-type="entity-link" >DeviceInputsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceInputUpdate.html" data-type="entity-link" >DeviceInputUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceMeter.html" data-type="entity-link" >DeviceMeter</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceMeterGet.html" data-type="entity-link" >DeviceMeterGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceMetersResolver.html" data-type="entity-link" >DeviceMetersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceMetersResolverBase.html" data-type="entity-link" >DeviceMetersResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceMeterUpdate.html" data-type="entity-link" >DeviceMeterUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceOutput.html" data-type="entity-link" >DeviceOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceOutputGet.html" data-type="entity-link" >DeviceOutputGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceOutputsResolver.html" data-type="entity-link" >DeviceOutputsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceOutputsResolverBase.html" data-type="entity-link" >DeviceOutputsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceOutputUpdate.html" data-type="entity-link" >DeviceOutputUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceSpecStorer.html" data-type="entity-link" >DeviceSpecStorer</a>
                            </li>
                            <li class="link">
                                <a href="classes/DevicesResolver.html" data-type="entity-link" >DevicesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DevicesResolverBase.html" data-type="entity-link" >DevicesResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceType.html" data-type="entity-link" >DeviceType</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeCategory.html" data-type="entity-link" >DeviceTypeCategory</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeCategoryGet.html" data-type="entity-link" >DeviceTypeCategoryGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeCategorysResolver.html" data-type="entity-link" >DeviceTypeCategorysResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeCategorysResolverBase.html" data-type="entity-link" >DeviceTypeCategorysResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeCategoryUpdate.html" data-type="entity-link" >DeviceTypeCategoryUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeGet.html" data-type="entity-link" >DeviceTypeGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypesResolver.html" data-type="entity-link" >DeviceTypesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypesResolverBase.html" data-type="entity-link" >DeviceTypesResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeTriggerArg.html" data-type="entity-link" >DeviceTypeTriggerArg</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeUpdate.html" data-type="entity-link" >DeviceTypeUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceUpdate.html" data-type="entity-link" >DeviceUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Domain.html" data-type="entity-link" >Domain</a>
                            </li>
                            <li class="link">
                                <a href="classes/DomainGet.html" data-type="entity-link" >DomainGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/DomainsResolver.html" data-type="entity-link" >DomainsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/DomainsResolverBase.html" data-type="entity-link" >DomainsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/DomainUpdate.html" data-type="entity-link" >DomainUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Event.html" data-type="entity-link" >Event</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventGet.html" data-type="entity-link" >EventGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventsResolver.html" data-type="entity-link" >EventsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventsResolverBase.html" data-type="entity-link" >EventsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventUpdate.html" data-type="entity-link" >EventUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDeviceArgs.html" data-type="entity-link" >GetDeviceArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDeviceConnectionArgs.html" data-type="entity-link" >GetDeviceConnectionArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDeviceInputArgs.html" data-type="entity-link" >GetDeviceInputArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDeviceMeterArgs.html" data-type="entity-link" >GetDeviceMeterArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDeviceOutputArgs.html" data-type="entity-link" >GetDeviceOutputArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDeviceTypeArgs.html" data-type="entity-link" >GetDeviceTypeArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDeviceTypeCategoryArgs.html" data-type="entity-link" >GetDeviceTypeCategoryArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDomainArgs.html" data-type="entity-link" >GetDomainArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetEventArgs.html" data-type="entity-link" >GetEventArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetMailArgs.html" data-type="entity-link" >GetMailArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPagePermissionArgs.html" data-type="entity-link" >GetPagePermissionArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPowerSchedulerArgs.html" data-type="entity-link" >GetPowerSchedulerArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRepairItemArgs.html" data-type="entity-link" >GetRepairItemArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRepairOrderArgs.html" data-type="entity-link" >GetRepairOrderArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRepairOrderHistoryArgs.html" data-type="entity-link" >GetRepairOrderHistoryArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRepairRecordArgs.html" data-type="entity-link" >GetRepairRecordArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRepairTypeArgs.html" data-type="entity-link" >GetRepairTypeArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRepairUserRecordArgs.html" data-type="entity-link" >GetRepairUserRecordArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRoleArgs.html" data-type="entity-link" >GetRoleArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSchedulerArgs.html" data-type="entity-link" >GetSchedulerArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSettingArgs.html" data-type="entity-link" >GetSettingArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserArgs.html" data-type="entity-link" >GetUserArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpClient.html" data-type="entity-link" >HttpClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpClient-1.html" data-type="entity-link" >HttpClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpClientError.html" data-type="entity-link" >HttpClientError</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto-1.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Mail.html" data-type="entity-link" >Mail</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailGet.html" data-type="entity-link" >MailGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailsResolver.html" data-type="entity-link" >MailsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailsResolverBase.html" data-type="entity-link" >MailsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailUpdate.html" data-type="entity-link" >MailUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/MqttClient.html" data-type="entity-link" >MqttClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulterHelper.html" data-type="entity-link" >MulterHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagePermission.html" data-type="entity-link" >PagePermission</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagePermissionGet.html" data-type="entity-link" >PagePermissionGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagePermissionsResolver.html" data-type="entity-link" >PagePermissionsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagePermissionsResolverBase.html" data-type="entity-link" >PagePermissionsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagePermissionUpdate.html" data-type="entity-link" >PagePermissionUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhoneNotifyDto.html" data-type="entity-link" >PhoneNotifyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pomcube.html" data-type="entity-link" >Pomcube</a>
                            </li>
                            <li class="link">
                                <a href="classes/PowerScheduler.html" data-type="entity-link" >PowerScheduler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PowerSchedulerGet.html" data-type="entity-link" >PowerSchedulerGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/PowerSchedulersResolver.html" data-type="entity-link" >PowerSchedulersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/PowerSchedulersResolverBase.html" data-type="entity-link" >PowerSchedulersResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/PowerSchedulerUpdate.html" data-type="entity-link" >PowerSchedulerUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecordConverter.html" data-type="entity-link" >RecordConverter</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairItem.html" data-type="entity-link" >RepairItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairItemGet.html" data-type="entity-link" >RepairItemGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairItemsResolver.html" data-type="entity-link" >RepairItemsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairItemsResolverBase.html" data-type="entity-link" >RepairItemsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairItemUpdate.html" data-type="entity-link" >RepairItemUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrder.html" data-type="entity-link" >RepairOrder</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrderGet.html" data-type="entity-link" >RepairOrderGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrderHistory.html" data-type="entity-link" >RepairOrderHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrderHistoryGet.html" data-type="entity-link" >RepairOrderHistoryGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrderHistorysResolver.html" data-type="entity-link" >RepairOrderHistorysResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrderHistorysResolverBase.html" data-type="entity-link" >RepairOrderHistorysResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrderHistoryUpdate.html" data-type="entity-link" >RepairOrderHistoryUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrdersResolver.html" data-type="entity-link" >RepairOrdersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrdersResolverBase.html" data-type="entity-link" >RepairOrdersResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairOrderUpdate.html" data-type="entity-link" >RepairOrderUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairRecord.html" data-type="entity-link" >RepairRecord</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairRecordGet.html" data-type="entity-link" >RepairRecordGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairRecordsResolver.html" data-type="entity-link" >RepairRecordsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairRecordsResolverBase.html" data-type="entity-link" >RepairRecordsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairRecordUpdate.html" data-type="entity-link" >RepairRecordUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairType.html" data-type="entity-link" >RepairType</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairTypeGet.html" data-type="entity-link" >RepairTypeGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairTypesResolver.html" data-type="entity-link" >RepairTypesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairTypesResolverBase.html" data-type="entity-link" >RepairTypesResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairTypeUpdate.html" data-type="entity-link" >RepairTypeUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairUserRecord.html" data-type="entity-link" >RepairUserRecord</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairUserRecordGet.html" data-type="entity-link" >RepairUserRecordGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairUserRecordsResolver.html" data-type="entity-link" >RepairUserRecordsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairUserRecordsResolverBase.html" data-type="entity-link" >RepairUserRecordsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepairUserRecordUpdate.html" data-type="entity-link" >RepairUserRecordUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link" >Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGet.html" data-type="entity-link" >RoleGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/RolesResolver.html" data-type="entity-link" >RolesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RolesResolverBase.html" data-type="entity-link" >RolesResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleUpdate.html" data-type="entity-link" >RoleUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Scheduler.html" data-type="entity-link" >Scheduler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SchedulerGet.html" data-type="entity-link" >SchedulerGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/SchedulersResolver.html" data-type="entity-link" >SchedulersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/SchedulersResolverBase.html" data-type="entity-link" >SchedulersResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/SchedulerUpdate.html" data-type="entity-link" >SchedulerUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Setting.html" data-type="entity-link" >Setting</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingGet.html" data-type="entity-link" >SettingGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsResolver.html" data-type="entity-link" >SettingsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsResolverBase.html" data-type="entity-link" >SettingsResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingUpdate.html" data-type="entity-link" >SettingUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/User-1.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserGet.html" data-type="entity-link" >UserGet</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolver.html" data-type="entity-link" >UsersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolver-1.html" data-type="entity-link" >UsersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolverBase.html" data-type="entity-link" >UsersResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolverBase-1.html" data-type="entity-link" >UsersResolverBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserUpdate.html" data-type="entity-link" >UserUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserUpdate-1.html" data-type="entity-link" >UserUpdate</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWithPermission.html" data-type="entity-link" >UserWithPermission</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWithPermission-1.html" data-type="entity-link" >UserWithPermission</a>
                            </li>
                            <li class="link">
                                <a href="classes/Util.html" data-type="entity-link" >Util</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DeviceConnectionServiceBase.html" data-type="entity-link" >DeviceConnectionServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceInputServiceBase.html" data-type="entity-link" >DeviceInputServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceMeterService.html" data-type="entity-link" >DeviceMeterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceMeterService-1.html" data-type="entity-link" >DeviceMeterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceMeterServiceBase.html" data-type="entity-link" >DeviceMeterServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceOutputServiceBase.html" data-type="entity-link" >DeviceOutputServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceServiceBase.html" data-type="entity-link" >DeviceServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceTypeCategoryServiceBase.html" data-type="entity-link" >DeviceTypeCategoryServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceTypeServiceBase.html" data-type="entity-link" >DeviceTypeServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DomainServiceBase.html" data-type="entity-link" >DomainServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventServiceBase.html" data-type="entity-link" >EventServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GqlAuthGuard.html" data-type="entity-link" >GqlAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard-1.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailServiceBase.html" data-type="entity-link" >MailServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PagePermissionServiceBase.html" data-type="entity-link" >PagePermissionServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PowerSchedulerServiceBase.html" data-type="entity-link" >PowerSchedulerServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepairItemServiceBase.html" data-type="entity-link" >RepairItemServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepairOrderHistoryServiceBase.html" data-type="entity-link" >RepairOrderHistoryServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepairOrderServiceBase.html" data-type="entity-link" >RepairOrderServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepairRecordServiceBase.html" data-type="entity-link" >RepairRecordServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepairTypeServiceBase.html" data-type="entity-link" >RepairTypeServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepairUserRecordServiceBase.html" data-type="entity-link" >RepairUserRecordServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleServiceBase.html" data-type="entity-link" >RoleServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SchedulerServiceBase.html" data-type="entity-link" >SchedulerServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingServiceBase.html" data-type="entity-link" >SettingServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadPipe.html" data-type="entity-link" >UploadPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserServiceBase.html" data-type="entity-link" >UserServiceBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserServiceBase-1.html" data-type="entity-link" >UserServiceBase</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});