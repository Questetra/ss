const webdriverio = require('webdriverio');

const fs = require('fs');

const Annotation = require('./captureAnnotation.js').Annotation;
const cAnoColors = require('./captureAnnotation.js').COLORS;
const cAnoPosition = require('./captureAnnotation.js').POSITION;

const cGunAdd = require('./captureGun.js').addTrigger;
const cGunWait = require('./captureGun.js').waitUntil;
const cGunRemove = require('./captureGun.js').removeTrigger;

const nowDate = new Date();

var chai = require('chai');
var chaiAsPromised = require('./chai-as-promised.js');

const config = require('./config.js');

let client;

function makePathFlat(str, subDir) {
    if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir);
    }
    return `${subDir}/${str}.png`;
};

function hide(target, num) {

    var e = $(target); //
    if (e.length > 1 && typeof num !== "undefined") {
        $(e[num]).hide();
        return "A";
    }
    return e.size();
}

function show(target) {
    $(target).show();
}

/*
function removeCaptureTrigger() {
    var $ = jQuery;
    $(".capture-trigger-item").remove();
    return;
}
*/
module.exports = function() {
    describe('Manual Capture Start', () => {

        before(function(done) {
            this.timeout(30000);
            client = webdriverio
                .remote({ desiredCapabilities: { browserName: 'chrome' } })
                .init()
                .url(config.context + "/Login_show")
                .call(done)
                .setViewportSize({
                    width: 1200,
                    height: 630
                });

            chai.Should();
            chai.use(chaiAsPromised);
            chaiAsPromised.transferPromiseness = client.transferPromiseness;

            process.on('uncaughtException', (err) => {
                const date = new Date().toLocaleString().replace(/\s|\//g, '-').replace(/:/g, '');
                console.log(`        ScrrenShot: error${date}.png`);
                client.saveScreenshot(makePathFlat(`error${date}`, 'error'));
            });
        });
        after(function(done) {
            this.timeout(10000);
            client.end().call(done);
        });
/*
        describe('GET Version', () => {
            it('is OK', function(done) {
                client
                    .getText('div[class=version]').then(function(versionText) {
                        var re = /ver\.\s([^\s]*?)\s/;
                        var found = versionText.match(re);
                        if (found) {
                            var version = found[1].replace(/\./g, "-");
                            config.subdir = version;
                        }
                    })
                    .call(done);
            });
        });
*/
        describe('Login > Flash有効化 > Logout', () => {
            it('is OK', function(done) {
                this.timeout(30000);
                client
                    .url(config.context + "/Login_show").then().pause(2000)

                    .execute(cGunAdd, 'オレンジアラートをとじてはいけません')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .setViewportSize({
                        width: 1200,
                        height: 630
                    })

                    .setValue('input[name=j_username]', config.qusers.admin.mail)
                    .setValue('input[name=j_password]', config.qusers.admin.password)
                    .click('input[class=login-submit]')
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=1').then()
                    .click("a[href='http://www.adobe.com/go/getflashplayer']").then()
                    .pause(10000).then()
                    .url(config.context + '/j_spring_security_logout').pause(2000)
                    .call(done);
            });
        });

/*
        // ***********************************************************************************************
        describe('タスクの生成 Login', () => {
            it('is OK', function(done) {
                this.timeout(120000);
                client
                    .url(config.context + "/Login_show").then().pause(2000)
                    .setValue('input[name=j_username]', config.qusers.tasker.mail).pause(500)
                    .setValue('input[name=j_password]', config.qusers.tasker.password).pause(1000)
                    .click('input[class=login-submit]').pause(2000)
                    .setViewportSize({
                        width: 1200,
                        height: 630
                    })
                .call(done);
            });
        });

        describe('タスクの生成 期限の切れたタスク', () => {
            it('is OK', function(done) {
                this.timeout(120000);
                client
                    // 期限の切れたタスクを依頼する
                    .url(config.context + '/PE/ProcessModel/listView').then().pause(2000)
                    .click("a[href^='/PE/ProcessInstance/startAndExecute?processModelInfoId=4']").pause(2000)
                    .execute(function() {
                        var $ = jQuery;

                        var yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 3);
                        var yesterdayYear = yesterday.getFullYear();
                        var yesterdayMonth = ("0" + (yesterday.getMonth() + 1)).slice(-2);
                        var yesterdayDate = ("0" + yesterday.getDate()).slice(-2);

                        var yesterday2 = new Date();
                        yesterday2.setDate(yesterday2.getDate() - 4);
                        var yesterday2Year = yesterday2.getFullYear();
                        var yesterday2Month = ("0" + (yesterday2.getMonth() + 1)).slice(-2);
                        var yesterday2Date = ("0" + yesterday2.getDate()).slice(-2);

                        $("input[name='title']").val("[調査依頼] 漢の中の漢とは誰の事か？");
                        $("input[name='data[5].input']").val("漢、それすなわち男のことなり");
                        $("input[name='data[2].input']").val(yesterday2Year + "-" + yesterday2Month + "-" + yesterday2Date);
                        $("input[name='data[3].email']").val("yamamoto+capture01@questetra.com");
                        $("input[name='data[4].input']").val(yesterdayYear + "-" + yesterdayMonth + "-" + yesterdayDate);

                        return;
                    }).then()
                    .click("input[id='submitButton']").pause(2000)
                    .alertAccept()
                    .then(function(){
                        console.log("\t　作業依頼フロー　期限の切れたタスク");
                    })
                .call(done);
            });
        });

        describe('タスクの生成 期限内のタスク', () => {
            it('is OK', function(done) {
                this.timeout(120000);
                client
                    // 期限内のタスクを生成
                    .url(config.context + '/PE/ProcessModel/listView').then().pause(2000)
                    .click("a[href^='/PE/ProcessInstance/startAndExecute?processModelInfoId=4']").pause(2000)

                    .setValue("input[name='data[3].dummy']", "太").then()
                    .scroll("input[name='data[3].dummy']", 0, -100)
                    .execute(Annotation.rectangle, "input[name='data[3].dummy']", {
                        text: "ユーザ型データ",
                        position: cAnoPosition.RIGHT
                    }, cAnoColors[0], null, null, [5, 5, 20, 70]).then()
                    .saveScreenshot(makePathFlat('M210-2', 'manual')).then()
                    .execute(Annotation.clear).then()

                    .execute(function() {
                        var $ = jQuery;
                        var now = new Date();
                        var nowYear = now.getFullYear();
                        var nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);
                        var nowDate = ("0" + now.getDate()).slice(-2);

                        var tommorow = new Date();
                        tommorow.setDate(tommorow.getDate() + 1);
                        var tommorowYear = tommorow.getFullYear();
                        var tommorowMonth = ("0" + (tommorow.getMonth() + 1)).slice(-2);
                        var tommorowDate = ("0" + tommorow.getDate()).slice(-2);

                        $("input[name='title']").val("[青年の主張] 社長さえやる気になれば「業務改革」は進む。");
                        $("input[name='data[5].input']").val("トップダウンですなぁ");
                        $("input[name='data[2].input']").val(nowYear + "-" + nowMonth + "-" + nowDate);
                        $("input[name='data[3].email']").val("yamamoto+capture01@questetra.com");
                        $("input[name='data[4].input']").val(tommorowYear + "-" + tommorowMonth + "-" + tommorowDate);
                        return;
                    }).then()
                    .click("input[id='submitButton']").pause(2000)
                    .alertAccept()
                    .then(function(){
                        console.log("\t　作業依頼フロー　期限内のタスク");
                    })
                .call(done);
            });
        });

        describe('タスクの生成 投資判断フロー', () => {
            it('is OK', function(done) {
                this.timeout(120000);
                client
                    // 投資判断フロー
                    .url(config.context + '/PE/ProcessModel/listView').then().pause(2000)
                    .click("a[href^='/PE/ProcessInstance/startAndExecute?processModelInfoId=18']").pause(2000)
                    .execute(function() {
                        var $ = jQuery;

                        $("input[name='title']").val("株式会社 クエステトラ")
                        $("input[name='data[3].input']").val("CRM分野におけるクラウドサービスを展開している\n本分野は今後3-5年で急成長が見込まれており、その中においてサービスのコンセプト、技術力、チームという点で、非常に有望な企業である。")
                        return;
                    }).then()
                    .execute(cGunAdd, 'M212-2 : ファイルを添付する')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .click("input[id='submitButton']").pause(2000)
                    .alertAccept()
                    .then(function(){
                        console.log("\t　投資判断フロー");
                    })
                .call(done);
            });
        });

        describe('タスクの生成 翻訳', () => {
            it('is OK', function(done) {
                this.timeout(120000);
                client
                    // 翻訳
                    .url(config.context + '/PE/ProcessModel/listView').pause(5000)
                    .click("a[href^='/PE/ProcessInstance/startAndExecute?processModelInfoId=20']").pause(5000).then()
                    .execute(function() {
                        var $ = jQuery;
                        $("input[name='title']").val("WEBページ：Questetra を使いこなそう");
                        $("textarea[name='data[1].console']").val("https://www.questetra.com/ja/tour/");
                        $("textarea[name='data[3].input']").val("Questetra BPM Suite を使いこなそう\n業務プロセスの整備で業務データの受け渡しがどんどんスムーズに！（個人→反復管理→組織標準→定量予測→環境統合）\n\n初めての業務設計\nクラウド型ワークフロー Questetra BPM Suite の基本的な操作を学ぶチュートリアルです。非常にシンプルな業務フロー「日次報告」（日報）を題材に、業務プロセス管理を体験してみてください。")
                        return;
                    }).then()
                    //.click("input[id=^'discussion_']").pause(5000)
                    //.alertAccept()
                    .click("input[id='submitButton']").pause(5000)
                    .alertAccept()
                    .then(function(){
                        console.log("\t　翻訳フロー");
                    })

                    .url(config.context + '/j_spring_security_logout').pause(3000)
                    .call(done);
            });
        });
        // ***********************************************************************************************

        describe('Login > Google連携/SAML連携　有効化 > Logout > M101-3 > Login > Google連携/SAML連携　無効化 > Logout > M101-2', () => {
            it('is OK', function(done) {
                this.timeout(120000);
                client
                    //  Google連携/SAML連携　有効化
                    //Login
                    .url(config.context + "/Login_show").then().pause(5000)
                    .setValue('input[name=j_username]', config.qusers.admin.mail).pause(500)
                    .setValue('input[name=j_password]', config.qusers.admin.password).pause(500)
                    .click('input[class=login-submit]').pause(3000)
                    // Google 連携有効化
                    .url(config.context + '/Admin/GoogleAppsDomain/view')
                    .setValue('input[name=domain]', 'questetra.com')
                    .click("input[id='GoogleAppsDomain_update_0']").then().pause(2000)
                    // SAML 連携有効化
                    .url(config.context + '/Admin/Saml/view').then()
                    .execute(function() {
                        var $ = jQuery;
                        $("input[id='Saml_edit_enable']").prop('checked', true);
                        $("input[name='entityId']").val("dummy");
                        $("input[name='ssoUrl']").val("https://dummy.com");
                        $("textarea[name='certificate']").val("-----BEGIN CERTIFICATE-----\nMIIDGjCCAgKgAwIBAgIET7GlgDANBgkqhkiG9w0BAQUFADBPMQswCQYDVQQGEwJKUDEOMAwGA1UECBMFa3lvdG8xDjAMBgNVBAcTBWt5b3RvMRIwEAYDVQQKEwlxdWVzdGV0cmExDDAKBgNVBAMTA2JwbTAeFw0xMjA1MTUwMDM4MjRaFw0yMjA1MTMwMDM4MjRaME8xCzAJBgNVBAYTAkpQMQ4wDAYDVQQIEwVreW90bzEOMAwGA1UEBxMFa3lvdG8xEjAQBgNVBAoTCXF1ZXN0ZXRyYTEMMAoGA1UEAxMDYnBtMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0ZeQOSGMRYdaDBnCxGV8yG53n5DcSlZEwJYu570CpIHrzUx7r41HL7Cx4JOj+nB7e0l9jz4erJl1w4M3+b7BndIJ0ERPUxDRC/8JbC7Mdw5NIxT5OvLUDhCXhiSoVmK9EpezQE9JYLggdXaRAHVQE3Hzi+YLQlSVMYxyKx8CzXjqXrsWa38QweejYw82V6HXXejAw/ow1oul32UQdqfBbbsLwOMl2++Ycdpbl0q/+Iuo+/joTkYb7WplzNK+re33nS7/PoyGIaIEMI8r4Bk1tn3vPosnb+h50dl71ZUlDfl8WDkR7hl6socBNWHv/FUDnvmp035beiOMcUmSHBgN9QIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQAFS8OzTy7De4iGLP4c2BEodI/aZNbb1DRl4eBdH7yKxLkFP6iA2qO7AVdHPx1UHQy/Yl7x2ao1mn//k4wDlEqCjc2bD3WPqjRGWxSSqs0xu/maGX2v3sTYM/4hjmqXYVL3bN8TN5MNIE1KJoG5AnzpVlIkYDP9OJJCg962xHuEXjCo29DCOARsQdrhasTnfDa2ApHA97k/pAGQKFjhhsdy4JmaL7J579B3Ju2wqY5Xnj1OpUAQ0SqMPmTlJ2P451pTwi6DMeoi9JwjjLxxZjBL/+gvRX6ppuvcJ3wrPClB9NS3fSfRNzWWxxNkw3Esd06VzMW0g2Z3JfYVVeewubau\n-----END CERTIFICATE-----");
                        return;
                    }).then().pause(2000)
                    .click('input[id=Saml_edit_0]').pause(2000)
                    // Logout
                    .url(config.context + '/j_spring_security_logout').pause(2000)
                    // Login画面
                    .url(config.context + "/Login_show")
                    .setValue('input[name=j_username]', 'example@example.com')
                    .setValue('input[name=j_password]', 'example')
                    .execute(Annotation.rectangle, "form[action='/j_spring_openid_security_check'] input[class='login-submit']", {
                        text: "G Suite 連携モード",
                        position: cAnoPosition.RIGHT
                    }).then()
                    .execute(Annotation.rectangle, "form[action='/saml/login'] input[class='login-submit']", {
                        text: "SAML 連携モード",
                        position: cAnoPosition.RIGHT
                    }).then()
                    .saveScreenshot(makePathFlat('M101-3', 'manual'))
                    .execute(Annotation.clear).then()
                    // Google連携/SAML連携　無効化
                    // Login
                    .url(config.context + "/Login_show").then().pause(5000)
                    .setValue('input[name=j_username]', config.qusers.admin.mail).pause(2000)
                    .setValue('input[name=j_password]', config.qusers.admin.password).pause(2000)
                    .click('input[class=login-submit]').pause(3000)
                    // Google 連携無効化
                    .url(config.context + '/Admin/GoogleAppsDomain/view')
                    .setValue('input[name=domain]', '')
                    .click("input[id='GoogleAppsDomain_update_0']").then().pause(2000)
                    // SAML 連携無効化
                    .url(config.context + '/Admin/Saml/view').then()
                    .execute(function() {
                        var $ = jQuery;
                        $("input[id='Saml_edit_enable']").prop('checked', false);
                        return;
                    }).then().pause(2000)
                    .click('input[id=Saml_edit_0]').pause(2000)
                    // Logout
                    .url(config.context + '/j_spring_security_logout').pause(2000)
                    // capture M101-2
                    .url(config.context + "/Login_show")
                    .setValue('input[name=j_username]', 'example@example.com')
                    .setValue('input[name=j_password]', 'example')
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "メールアドレスLogin<br />(ノーマルLogin)", {}).then(function(ret) {
                        console.log("\t\t" + ret.value.join("\n\t\t")); // outputs: 10
                    }).then()
                    .saveScreenshot(makePathFlat('M101-2', 'manual'))
                    .execute(Annotation.clear).then()
                    .call(done);
            });
        });
*/
        describe('Login', () => {
            it('is OK', function(done) {
                this.timeout(10000);
                client
                    .url(config.context + "/Login_show").then().pause(3000)
                    .setValue('input[name=j_username]', config.qusers.admin.mail).pause(500)
                    .setValue('input[name=j_password]', config.qusers.admin.password).pause(500)
                    .click('input[class=login-submit]').pause(2000).then()
                    .setViewportSize({
                        width: 1200,
                        height: 630
                    })
                    .call(done);
            });
        });
/*
        describe('M101-1', () => {
            it('is OK', function(done) {
                this.timeout(20000);
                client
                    .url(config.context + '/PE/Workitem/list').pause(5000)
                    .execute(Annotation.rectangle, ".side-menu a[href='/PE/Workitem/list']", {
                        text: "マイタスク",
                        position: cAnoPosition.BOTTOM_RIGHT
                    }).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "≒ 引き受けた仕事").then()
                    .saveScreenshot(makePathFlat('M101-1', 'manual'))
                    .execute(Annotation.clear).then()
                    .call(done);
            });
        });

        describe('M102-1', () => {
            it('is OK', function(done) {
                this.timeout(20000);
                client
                    .url(config.context + '/PE/ProcessModel/listView').pause(2000)
                    .execute(Annotation.rectangle, "#processModels", {
                        text: "開始フローの選択",
                        position: cAnoPosition.BOTTOM
                    }, cAnoColors[1]).then()
                    .execute(Annotation.rectangle, ".side-menu a[href='/PE/ProcessModel/listView']", {
                        text: "新規開始メニュー",
                        position: cAnoPosition.BOTTOM_RIGHT
                    }).then()
                    .saveScreenshot(makePathFlat('M102-1', 'manual'))
                    .execute(Annotation.clear).then()

                    .click("a[href='/OR/ProcessModel/view?processModelInfoId=4']").pause(2000).then()
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "業務マニュアル").then()
                    .saveScreenshot(makePathFlat('M102-2', 'manual'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PE/ProcessModel/listView').pause(2000)
                    .click("a[href='/PE/ProcessInstance/startAndExecute?processModelInfoId=4&nodeNumber=1']").pause(2000).then()
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "入力画面").then()
                    .saveScreenshot(makePathFlat('M102-3', 'manual'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PE/Workitem/list').pause(2000)
                    .alertAccept()

                    .call(done);

            });
        });

        describe('M201-1', () => {
            it('is OK', function(done) {
                this.timeout(20000);
                client
                    .url(config.context + '/PMM/ProcessModel/showUpload').pause(5000)
                    .setValue('input[name=fileUrl]', 'https://d6a5bbe7-a-0a931d3c-s-sites.googlegroups.com/a/workflow-sample.net/workflow-sample-archives/home/ja/20151116-General_Work_Request-Cost-ja.qar?attachauth=ANoY7crwKSsSXozclpNLhcfgYZCDxZMAIgsgZmnKswVYuymzH4l1mf97mWjNPFFeyn6km0LBB2cg4nHT4PXqmoqahfAqRpwEOU-vYbRaAhrjsedCeRyi23LGKAyE-WPKt3w6ZCMxauXSwMRU5yBNlyTmIUOxotACWPplDiK11m_axBWb42IDtsRE_K-NOjRvubwjyb-twKtcNGLqW9Qr-iK-vmSLi7l8VrHLvvMtuBxq2-j1cWVwhBMNMSK0avGg7rtIClxzTrqg1LeZiGpnbxdIM7XyMZ0XT336BdRwtBdTc74vCYnAdYo%3D&attredirects=1')
                    .keys('\uE007').pause(2000).then()
                    .execute(function() {
                        var $ = jQuery;
                        $("form[id=ProcessModel_commitUpload] table.form").hide();
                        return;
                    }).then()
                    .click("ul.system-menu").pause(2000).then()
                    .execute(Annotation.rectangle, ".system-menu a[href='/PMM/ProcessModel/list']", {
                        text: "モデリングメニューから",
                        position: cAnoPosition.BOTTOM_LEFT
                    }).then()
                    .execute(Annotation.rectangle, "#ProcessModel_commitUpload_0", {
                        text: "追加",
                        position: cAnoPosition.RIGHT
                    }).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "サンプル定義の<br />インポートも").then(function(ret) {
                        console.log("\t\t" + ret.value.join("\n\t\t")); // outputs: 10
                    }).then()
                    .saveScreenshot(makePathFlat('M201-1', 'manual'))
                    .execute(Annotation.clear).then()
                    .call(done);
            });
        });

        describe('M201-2', () => {
            it('is OK', function(done) {
                this.timeout(100000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=4').pause(3000)
                    .execute(Annotation.rectangle, "div.system a[href^='/PMM/ProcessModel/Version/edit?']", {
                        text: "(モデリング画面へ)",
                        position: cAnoPosition.TOP_RIGHT
                    }, cAnoColors[1], null, null, [1, 1, 30, 1]).then()
                    .execute(Annotation.rectangle, "a[id='activateButton']", {
                        text: "[アプリ]を業務システムとして稼働",
                        position: cAnoPosition.BOTTOM_RIGHT
                    }, cAnoColors[0], null, null, [5, 15, -20, 30]).then()
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "管理画面").then()
                    .saveScreenshot(makePathFlat('M201-2', 'manual'))
                    .execute(Annotation.clear).then()

                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "モデリング画面").then()
                    .execute(cGunAdd, 'M201-3 : プロパティを開くなど、にぎやかす')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M201-3', 'manual'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });

        describe('M202-1, M202-2, M202-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=4')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M202-1 : プロパティを開き、締め切り/通知メールタブを選択')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "各工程のプロパティで設定").then()
                    .saveScreenshot(makePathFlat('M202-1', 'manual/base'))
                    .execute(Annotation.clear).then(function(){
                        console.log("\tM202-1");
                    })

                    .url(config.context + '/PE/Workitem/list').then()
                    .execute(Annotation.rectangle, "span[class='errorMessage']", {
                        text: "[マイタスク]の締め切り表示",
                        position: cAnoPosition.TOP_LEFT
                    }, cAnoColors[0], null, null, [15, 5, 5, 5]).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "[マイタスク]の締め切り表示").then(function(ret) {
                        console.log("\t\t" + ret.value.join("\n\t\t")); // outputs: 10
                    }).then()
                    .saveScreenshot(makePathFlat('M202-2', 'manual'))
                    .execute(Annotation.clear).then().then(function(){
                        console.log("\tM202-2");
                    })

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=11')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M202-3 : タイマー境界のプロパティを開き、締め切り/通知タブを選択')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "作業打ち切りにも").then()
                    .saveScreenshot(makePathFlat('M202-3', 'manual/base'))
                    .execute(Annotation.clear).then()
                    .then(function(){
                        console.log("\tM202-3");
                    })

                    .call(done);
            });
        });

        describe('M203-1, M203-2 M203-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=5')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M203-1 : advanced の　ゲートウェイを開く', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "全経路、1経路、ｎ経路").then()
                    .saveScreenshot(makePathFlat('M203-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=6')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M203-2 : advanced の　ゲートウェイを開く', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "単一選択の2書式").then()
                    .saveScreenshot(makePathFlat('M203-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=7')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M203-3 : ゲートウェイのプロパティを開く',5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.BOTTOM_RIGHT, "ORゲートウェイ").then()
                    .saveScreenshot(makePathFlat('M203-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=5')
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M204-1, M204-2 M204-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=8')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "トークン増殖ループの禁止").then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_RIGHT, "個別ループ or 合流後ループに").then()
                    .saveScreenshot(makePathFlat('M204-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=9')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "個別ループのパターン").then()
                    .saveScreenshot(makePathFlat('M204-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=10')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_RIGHT, "合流後ループのパターン").then()
                    .saveScreenshot(makePathFlat('M204-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=8')
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M205-1, M205-2 M205-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=11')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M205-1 : データ項目タブを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "業務データの定義").then()
                    .saveScreenshot(makePathFlat('M205-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M205-2 : 「ワークフロー図」タブを開き、タスクのプロパティを開き、「データ編集許可」タブを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "工程プロパティで閲覧レベル設定").then()
                    .saveScreenshot(makePathFlat('M205-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M205-3 : 「データ項目」タブ>「データ編集許可」を開く > 複数のデータ項目を選択する')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "一括して閲覧レベル設定").then()
                    .saveScreenshot(makePathFlat('M205-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=11')
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M206-1, M206-2 M206-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=13')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M206-1 : データ項目タブを開いて、必須項目のデータを選択する')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "処理画面での入力が必須に").then()
                    .saveScreenshot(makePathFlat('M206-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M206-2 : 数値型データ項目を選択する')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "最大値や少数桁数の制限").then()
                    .saveScreenshot(makePathFlat('M206-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M206-3 : テーブル型データ項目を選択する')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "[テーブル型]の書式設定").then()
                    .saveScreenshot(makePathFlat('M206-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });

        describe('M207-1, M207-2 M207-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=14')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M207-1 : データ項目タブを開いて、初期値が設定された（見積書番号）データ項目を選択する')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "プロセス起動時、値が自動セット").then()
                    .saveScreenshot(makePathFlat('M207-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M207-2 : 固定的初期値が設定された（見積提出先会社名）データ項目を選択、初期値編集ダイアログを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "固定的な値の設定").then()
                    .saveScreenshot(makePathFlat('M207-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M207-3 : 動的初期値が設定された（見積書番号）データ項目を選択、初期値編集ダイアログを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "動的な値の設定").then()
                    .saveScreenshot(makePathFlat('M207-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });

        describe('M208-1, M208-2 M208-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=15')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "上流で候補列挙").then()
                    .saveScreenshot(makePathFlat('M208-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M208-2 : データ項目タブ > 選択肢「ステータス」を選択 > 選択肢「編集」でダイアログを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "固定的な選択肢設定").then()
                    .saveScreenshot(makePathFlat('M208-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M208-3 : 続いて、選択肢「予算区分」を選択 > 選択肢「編集」でダイアログを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)

                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "動的な選択肢の設定").then()
                    .saveScreenshot(makePathFlat('M208-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });

        describe('M209-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=16')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()

                    .execute(cGunAdd, 'M209-1 : プロセスモデルがよく見えるよう調節')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "スイムレーン単位で担当者設定").then()
                    .saveScreenshot(makePathFlat('M209-1', 'manual'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M209-2 : 処理担当者タブ > ネットワーク管理者レーン > 編集 > 「組織」を選択 > 「より下位組織に所属するメンバ」のプルダウン表示',5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "[引受候補者]を一括して追加").then()
                    .saveScreenshot(makePathFlat('M209-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M209-3 : 処理担当者タブ > 使用者レーン >　編集')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.BOTTOM_RIGHT, "管掌役員の指定例").then()
                    .saveScreenshot(makePathFlat('M209-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });

        describe('M210-1 M210-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=4')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M210-1 : 処理担当者タブ > 依頼元スイムレーン「追加」 > データ項目で指定で「依頼先」にマウスオーバー', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M210-1', 'manual'))

                    .url(config.context + '/PE/Workitem/list').pause(3000).then()
                    .execute(function() {
                        var $ = jQuery;
                        $("input[name='query']").val('青年の主張')
                        return;
                    }).then()
                    .submitForm('#pi-search-form').pause(5000).then()
                    .click("a[href^='/OR/ProcessInstance/view?processInstanceId=']").pause(5000).then()
                    .scroll("h3[id='title-workitem']", 0, -200)
                    .saveScreenshot(makePathFlat('M210-3', 'manual'))

                    .call(done);
            });
        });

        describe('M211-1 M211-2 M211-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=17')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .saveScreenshot(makePathFlat('M211-1', 'manual'))

                    .url(config.context + '/PE/ProcessModel/listView').pause(3000).then()
                    .click("a[href^='/PE/ProcessInstance/startAndExecute?processModelInfoId=17&nodeNumber=']").pause(5000).then()
                    .scroll("input[name='data[10].input']", 0, -200)
                    .saveScreenshot(makePathFlat('M211-2', 'manual'))

                    .setValue("input[name='title']", '鈴木 クエ太')
                    .click("input[id='saveOnlyButton']").pause(2000).then()
                    .alertAccept()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=17')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M211-3 : 処理担当者タブを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M211-3', 'manual/base'))


                    .call(done);
            });
        });

        describe('M212-1 M212-2 M212-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=18')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .saveScreenshot(makePathFlat('M212-1', 'manual'))

                    .url(config.context + '/PE/Workitem/list').pause(3000).then()
                    .execute(function() {
                        var $ = jQuery;
                        $("input[name='query']").val('株式会社 クエステトラ')
                        return;
                    }).then()
                    .submitForm('#pi-search-form').pause(5000).then()
                    .click("a[href^='/OR/ProcessInstance/view?processInstanceId=']").pause(5000).then()
                    .click("a[href^='/PE/Workitem/Form/viewIframe?workitemId']").pause(5000).then()
                    .scroll("div[id='readonly_1']", 0, -200)
                    .saveScreenshot(makePathFlat('M212-2', 'manual'))

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=19')
                    .alertAccept()
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .saveScreenshot(makePathFlat('M212-3', 'manual'))
                    .call(done);
            });
        });

        describe('M213-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PE/Workitem/list').pause(3000).then()
                    .execute(function() {
                        var $ = jQuery;
                        $("input[name='query']").val('WEBページ：Questetra を使いこなそう')
                        return;
                    }).then()
                    .submitForm('#pi-search-form').pause(3000).then()
                    .click("a[href^='/OR/ProcessInstance/view?processInstanceId=']").pause(3000).then()
                    .click("a[href^='/PE/Workitem/Form/viewIframe?workitemId=']").pause(3000).then()
                    .execute(function() {
                        var $ = jQuery;
                        $("textarea[name='data[4].input']").val('How To Use Questetra BPMS\nDelivery of Business Data becomes more and more smoother by the improvement of Business Process. (Individual dependent → Iterative management → Organizational standard → Quantitative prediction → Environment compatible)\n\nBusiness Designing for the First Time\nThis is a tutorial to learn the basic operation of the cloud-based workflow Questetra BPM Suite. Get the feel of Business Process Management through a very simple Business flow, the “Daily report”.')
                        $("#mycounter").html('入力文字数<br />224 文字');
                        return;
                    }).then()
                    .scroll("div[id='readonly_3']", 0, -200).pause(1000)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "入力ミスを減らす項目名と注記").then(function(ret){
                        console.log("\t\t" + ret.value.join("\n\t\t")); // outputs: 10
                    }).pause(2000)
                    .saveScreenshot(makePathFlat('M213-1', 'manual/base'))
                    .execute(Annotation.clear).then()
                    .click("input[id='saveOnlyButton']").pause(2000).then()
                    .alertAccept()
                    .call(done);
            });
        });
        describe('M213-2', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client

                    // M213-2
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=20')
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M213-2 : データ項目タブを開く > 「翻訳添付」データ項目を選択')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "「文字の強調」や「外部リング」").then()
                    .saveScreenshot(makePathFlat('M213-2', 'manual/base'))
                    .execute(Annotation.clear).then()
                    .call(done);
            });
        });

        describe('M213-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    // M213-3
                    .execute(cGunAdd, 'M213-3 : 続いて、「翻訳文」データ項目を選択')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "JavaScriptで更なる工夫も").then()
                    .saveScreenshot(makePathFlat('M213-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });
        
        describe('M214-1 M214-2 M214-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PE/ProcessModel/listView').then().pause(2000)
                    .click("a[href^='/PE/ProcessInstance/startAndExecute?processModelInfoId=21']").pause(2000)
                    .execute(Annotation.rectangle, "a[onclick^='openNewWindow']", {
                        text: "業務マニュアルを表示",
                        position: cAnoPosition.BOTTOM_LEFT
                    }).then()
                    .saveScreenshot(makePathFlat('M214-1-a', 'manual/base'))
                    .then(function(){
                        console.log("\t　M214-1-a");
                    })
                    .execute(Annotation.clear).then()
                    .click("input[id='submitButton']").pause(2000)
                    .alertAccept()
                    

                    .url(config.context + '/OR/ProcessModel/Explanation/view?processModelInfoId=21').then().pause(2000)
                    .setViewportSize({
                        width: 991,
                        height: 533
                    })
                    .saveScreenshot(makePathFlat('M214-1-b', 'manual/base'))
                    .then(function(){
                        console.log("\t　M214-1-b");
                    })
                    .setViewportSize({
                        width: 1200,
                        height: 630
                    })

                    .url(config.context + '/OR/ProcessModel/Explanation/view?processModelInfoId=19').then().pause(2000)
                    .execute(function() {
                        var $ = jQuery;
                        $("h2[class='system']").hide();
                        $("h3[class='system']").hide();
                        $("h4[class='system']").hide();
                        $("a[href^='/PMM/ProcessModel/Explanation/view?processModelInfoId=']").hide();
                        $("div[id='page-process-feed-wrapper']").hide();
                        $("div[class^='footer']").hide();

                        $('body').css({
                            'overflow-x' : 'hidden',
                            'overflow-y' : 'hidden'
                        });
                        $(".all-wrapper").css({
                            'margin': 0
                        });
                        $(".page-body").css({
                            'width': '100%',
                            'border' : 'none',
                            'padding' : '0 0 0 0'
                        });
                        $(".iframe-content").css({
                            'padding': '0 0 0 0',
                            'boder' : 'none'
                        });
                        $("div.markdown").css({
                            'border' : 'none',
                            'padding' : '5px 5px 5px 5px',
                            'margin' : '0 0 0 0'
                        });

                        return;
                    }).then()
                    .saveScreenshot(makePathFlat('M214-2', 'manual'))
                    .scroll("h1[id='s2']")
                    .saveScreenshot(makePathFlat('M214-3', 'manual'))

                    .call(done);
            });
        });

        describe('M215-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PE/Workitem/list').then().pause(2000)
                    .then(function(){
                        console.log("\t　既存の立替金申請タスクののキャプチャーを撮る");
                    })
                    .execute(function() {
                        var $ = jQuery;
                        $("input[name='query']").val('立替金')
                        return;
                    }).then()
                    .submitForm('#pi-search-form').pause(3000).then()
                    .click("a[href^='/OR/ProcessInstance/view?processInstanceId=']").pause(3000).then()
                    .click("a[href^='/PE/Workitem/Form/viewIframe?workitemId=']").pause(3000).then()
                    .scroll("h4[id='ss']")
                    .saveScreenshot(makePathFlat('M215-1', 'manual'))

                    .url(config.context + '/PE/Workitem/list').then().pause(2000)
                    .alertAccept()

                    .call(done);

            });
        });

        describe('M216-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PE/Workitem/list').then().pause(2000)
                    .then(function(){
                        console.log("\t　既存の問い合わせタスクののキャプチャーを撮る");
                    })
                    .execute(function() {
                        var $ = jQuery;
                        $("input[name='query']").val('テスト問い合わせ')
                        return;
                    }).then()
                    .submitForm('#pi-search-form').pause(3000).then()
                    .click("a[href^='/OR/ProcessInstance/view?processInstanceId=']").pause(3000).then()
                    .click("a[href^='/PE/Workitem/Form/viewIframe?workitemId=']").pause(3000).then()
                    .scroll("div[class='paper_outer']", 0, -20)
                    .saveScreenshot(makePathFlat('M216-1', 'manual'))

                    // 216-2
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=23').then().pause(2000)
                    .alertAccept()
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M216-2 : データ項目タブ > 「高度なレイアウトを編集」')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M216-2', 'manual'))

                    // 216-3
                    .url(config.context + '/PE/Workitem/list').then().pause(2000)
                    .then(function(){
                        console.log("\t　既存の書籍タスクののキャプチャーを撮る");
                    })
                    .execute(function() {
                        var $ = jQuery;
                        $("input[name='query']").val('書籍購入')
                        return;
                    }).then()
                    .submitForm('#pi-search-form').pause(3000).then()
                    .click("a[href^='/OR/ProcessInstance/view?processInstanceId=']").pause(3000).then()
                    .click("a[href^='/PE/Workitem/Form/viewIframe?workitemId=']").pause(3000).then()
                    .scroll("h2[class='isbn-view']", 0, -20)
                    .saveScreenshot(makePathFlat('M216-3', 'manual'))
                    .url(config.context + '/PE/Workitem/list').then().pause(2000)
                    .alertAccept()
 

                    .call(done);

            });
        });

// 20180111
        describe('M217-1, M217-2 M217-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=25').pause(3000)
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M217-1 : アドバンスド > タイマー開始イベントのアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "指定日時に自動開始（起動）").then()
                    .saveScreenshot(makePathFlat('M217-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    // Flash
                    .execute(cGunAdd, 'M217-2 : タイマー開始イベントのプロパティを開く > やや上寄せ')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "タイマー開始イベントの<br />プロパティで日時を指定").then()
                    .saveScreenshot(makePathFlat('M217-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    // Flash
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=26').pause(3000)
                    .alertAccept()
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M217-3 : タイマー開始イベントのプロパティを開く　> 下の方に寄せる')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "毎日・毎週・毎月・毎年<br />時刻・日にち・曜日<br />を指定").then()
                    .saveScreenshot(makePathFlat('M217-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    // alert
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=25').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M218-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=27').pause(3000)
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M218-1 : アドバンスド > メッセージ開始イベント（メール）のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "メール受信時に自動開始（起動）").then()
                    .saveScreenshot(makePathFlat('M218-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M218-2 : メッセージ開始イベント（メール）のプロパティを開く', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "メッセージ開始イベント（メール）の<br />プロパティで設定", 50).then()
                    .saveScreenshot(makePathFlat('M218-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=27').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M219-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=28').pause(3000)
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M219-1 : アドバンスド > メッセージ開始イベント（メール）のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "FAXの受信通知メールで自動開始").then()
                    .saveScreenshot(makePathFlat('M219-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M219-2 : メッセージ開始イベント（メール）のプロパティを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "メッセージ開始イベント<br />（メール）のプロパティで設定").then()
                    .saveScreenshot(makePathFlat('M219-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=28').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M220-1, M220-2', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    // M220-2-a
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=23').pause(3000)
                    .click("a[href^='/PMM/ProcessModel/view?processModelId=']").pause(5000).then()
                    .scroll("a[href^='/PMM/ProcessModel/view?processModelId=']", 0, -40)
                    .execute(cGunAdd, 'M220-2 : プロセス図 > メッセージ開始イベント（フォーム）のプロパティを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M220-2-a', 'manual/base'))
                    // M220-2-b
                    .url(config.context + '/PMM/ProcessModel/MessageReceiveEventForm/view?processModelInfoId=23&nodeNumber=3').pause(3000)
                    .setViewportSize({
                        width: 991,
                        height: 533
                    })
                    .saveScreenshot(makePathFlat('M220-2-b', 'manual/base'))
                    .then(function(){
                        console.log("\t　M220-2-b");
                    })
                    .setViewportSize({
                        width: 1200,
                        height: 630
                    })


                    // M220-1
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=23').pause(3000)
                    .click("div.system a[href^='/PMM/ProcessModel/Version/edit?']").pause(5000).then()
                    .execute(cGunAdd, 'M220-1 : アドバンスド > メッセージ開始イベント（フォーム）のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "Webフォームの入力で自動開始").then()
                    .saveScreenshot(makePathFlat('M220-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=23').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M221-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=29').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M220-1 : メッセージ開始イベント（HTTP）を選択 > アドバンスド > メッセージ開始イベント（HTTP）のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M222-2', 'manual/base'))
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "HTTPリクエストで自動開始").then()
                    .saveScreenshot(makePathFlat('M221-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=29').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });

        //*****************************
        // M222


        describe('M222-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .then(function(){
                        console.log("\t　M222-1　: 作りにくいのでスキップ");
                    })
                    .call(done);
            });
        });


        describe('M223-1, M223-2, M223-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=30').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M223-1 : アドバンスド > タイマー中間イベント のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "タイマー中間イベントを配置").then()
                    .saveScreenshot(makePathFlat('M223-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M223-3 : XORゲートウェイのプロパティを開く > 「あり」の条件式設定 を開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M223-2', 'manual/base'))

                    .execute(cGunAdd, 'M223-2 : タイマー中間イベントのプロパティを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M223-3', 'manual/base'))

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=30').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });


         describe('M224-1, M224-2, M224-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=31').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M224-1 : アドバンスド > メッセージ送信中間イベント（メール） のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "業務データをメール文に挿入").then()
                    .saveScreenshot(makePathFlat('M224-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M224-2 : メッセージ送信中間イベント（メール） プロパティを開き > 「データ埋め込み」をプルダウン表示', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M224-2', 'manual/base'))

                    .then(function(){
                        console.log("\t　M224-3　: 作りにくいのでスキップ");
                    })

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=31').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M225-1, M225-2, M225-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=32').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M225-1 : アドバンスド > メッセージ送信中間イベント（HTTP） のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "業務データをHTTP通信で送信").then()
                    .saveScreenshot(makePathFlat('M225-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M225-2 : メッセージ送信中間イベント（HTTP）プロパティを開き > 「通信設定」タブを表示')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "HTTPリクエスト送信先や<br />通信方法を設定").then()
                    .saveScreenshot(makePathFlat('M225-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M225-3 : つづいて、「送信パラメータ」タブを表示　> paramBでプルダウンを表示', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "通信パラメータ名を設定").then()
                    .saveScreenshot(makePathFlat('M225-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=32').pause(3000)
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M226-1, M226-2, M226-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    // M226-2-b, M226-1
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=33').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .saveScreenshot(makePathFlat('M226-2-b', 'manual/base'))
                    .execute(cGunAdd, 'M226-1 : アドバンスド > メッセージ受信中間イベント（HTTP） のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "業務データ受信を<br />HTTPで待ち受け").then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "メッセージ受信中間イベント（HTTP）を配置", 50).then()
                    .saveScreenshot(makePathFlat('M226-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    // M226-2-a
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=34').pause(5000)
                    .alertAccept()
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "プロセス間で業務データを受け渡し", 50).then()
                    .saveScreenshot(makePathFlat('M226-2-a', 'manual/base'))
                    .execute(Annotation.clear).then()

                    // M226-3-a
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=33').pause(3000)
                    .click("a[href^='/PMM/ProcessModel/view?processModelId=']").pause(5000).then()
                    .scroll("a[href^='/PMM/ProcessModel/view?processModelId=']", 0, -40)
                    .execute(cGunAdd, 'M226-3-a : プロセス図 > メッセージ受信中間イベント（フォーム）のプロパティを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "待ち受け情報を確認").then()
                    .saveScreenshot(makePathFlat('M226-3-a', 'manual/base'))
                    .execute(Annotation.clear).then()
                    // M226-3-b
                    .url(config.context + '/PMM/ProcessModel/MessageReceiveEventHttp/view?processModelInfoId=33&nodeNumber=3').pause(3000)
                    .setViewportSize({
                        width: 991,
                        height: 533
                    })
                    .saveScreenshot(makePathFlat('M226-3-b', 'manual/base'))
                    .then(function(){
                        console.log("\t　M226-3-b");
                    })
                    .setViewportSize({
                        width: 1200,
                        height: 630
                    })

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=33').pause(5000)

                    .call(done);
            });
        });

        describe('M227-1, M227-2', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=35').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M227-1 : アドバンスド > サービスタスク（データ設定）　のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "業務データ受信を<br />自動セット・加工").then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "サービスタスク（データ設定）を配置", 50).then()
                    .saveScreenshot(makePathFlat('M227-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M227-2 : サービスタスク（データ設定）　のプロパティを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "指定日の「翌日12時」をセット").then()
                    .saveScreenshot(makePathFlat('M227-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=35').pause(5000)
                    .alertAccept()

                    .call(done);
            });
        });

        describe('M228-1, M228-2, M228-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=37').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M228-1 : アドバンスド > サービスタスク（PDF生成）　のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "PDF帳票を自動生成").then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "サービス工程を配置", 50).then()
                    .saveScreenshot(makePathFlat('M228-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M228-2 : サービスタスク（PDF生成）のプロパティを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .saveScreenshot(makePathFlat('M228-3', 'manual/base'))
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "台紙PDFのサンプルをダウンロード", 50).then()
                    .saveScreenshot(makePathFlat('M228-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    // M228-3
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=20').pause(5000)
                    //.alertAccept()

                    .execute(cGunAdd, 'M228-4 : 「▼アプリ」をクリックし「アドオンの管理」にマウスオーバー',5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.rectangle, "a[href^='/PMM/ProcessModel/File/list?processModelInfoId=']", {
                        text: "この業務フローでしか使わない参照ファイルなら",
                        position: cAnoPosition.BOTTOM
                    }).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "業務プロセスに登録").then()
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "台紙PDF、選択肢XML、アドオン...", 50).then()
                    .saveScreenshot(makePathFlat('M228-3', 'manual'))
                    .execute(Annotation.clear).then()
                    
                    // M228-4
                    .url(config.context + '/Admin/SystemFile/list').pause(5000)
                    //.alertAccept()
                    .scroll("a[href='/Admin/SystemFile/list']", 0, -100)
                    .execute(Annotation.rectangle, "a[href='/Admin/SystemFile/list']", {
                        text: "さまざまなアプリから利用される参照ファイルなら",
                        position: cAnoPosition.BOTTOM_RIGHT
                    }).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "ワークフロー基盤に登録").then()
                    .execute(Annotation.title, cAnoPosition.TOP_RIGHT, "台紙PDF、選択肢XML、アドオン...", 50).then()
                    .saveScreenshot(makePathFlat('M228-5', 'manual'))
                    .execute(Annotation.clear).then()



                    .call(done);
            });
        });
*/
        describe('M229-1, M229-2, M229-3', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=38').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M229-1 : アドバンスド > サービスタスク（Googleドライブ）　のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "ファイルをGoogleドライブに保存", 50).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_RIGHT, "サービスタスク（Googleドライブ）を配置", 50).then()
                    .saveScreenshot(makePathFlat('M229-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .execute(cGunAdd, 'M229-2 : サービスタスク（Googleドライブ）　のプロパティを開く')
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "Google Apps 連携が設定されている<br />環境で利用可能", 50).then()
                    .saveScreenshot(makePathFlat('M229-2', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=39').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "自動化").then()
                    .saveScreenshot(makePathFlat('M229-3', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=39').pause(5000)
                    .alertAccept()


                    .call(done);
            });
        });
/*
        describe('M230-1', () => {
            it('is OK', function(done) {
                this.timeout(600000);
                client
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=40').pause(5000)
                    .click("a[href^='/PMM/ProcessModel/Version/edit?processModelId']").pause(5000).then()
                    .execute(cGunAdd, 'M230-1 : アドバンスド > スクリプトタスク　のアイコンにマウスをオーバーする（重なり注意）', 5)
                    .waitUntil(function() {
                        return cGunWait(client);
                    }, 500000).then().execute(cGunRemove)
                    .execute(Annotation.title, cAnoPosition.TOP_LEFT, "プログラムを実行できる工程").then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "スクリプトタスクを配置", 50).then()
                    .saveScreenshot(makePathFlat('M230-1', 'manual/base'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });     


        describe('プロセス消去', () => {
            it('is OK', function(done) {
                this.timeout(120000);
                client
                    .url(config.context + '/j_spring_security_logout').pause(2000).then()
                    .url(config.context + "/Login_show").then().pause(3000).then()
                    .setValue('input[name=j_username]', config.qusers.admin.mail).pause(500).then()
                    .setValue('input[name=j_password]', config.qusers.admin.password).pause(1000).then()
                    .click('input[class=login-submit]')
                    .pause(2000).then()
                    // 無効化

                    //　作業依頼
                    .url(config.context + '/PMM/ProcessModel/stop?processModelInfoId=4').then().pause(2000)
                    .click("input[id='stopProcessInstance-true']").then().pause(2000)
                    .click("form[id='stopForm'] input[type='submit']").then().pause(2000)
                    .then(function(){
                        console.log("\t　作業依頼　非稼働");
                    })
                    .url(config.context + '/PMM/ProcessModel/restart?processModelInfoId=4').then().pause(2000)
                    .then(function(){
                        console.log("\t　作業依頼");
                    })

                    //

                    .url(config.context + '/PMM/ProcessModel/stop?processModelInfoId=17').then().pause(2000)
                    .click("input[id='stopProcessInstance-true']").then().pause(2000)
                    .click("form[id='stopForm'] input[type='submit']").then().pause(2000)
                    .then(function(){
                        console.log("\t　採用選考　非稼働");
                    })
                    .url(config.context + '/PMM/ProcessModel/restart?processModelInfoId=17').then().pause(2000)
                    .then(function(){
                        console.log("\t　採用選考");
                    })


                    .url(config.context + '/PMM/ProcessModel/stop?processModelInfoId=18').then().pause(2000)
                    .click("input[id='stopProcessInstance-true']").then().pause(2000)
                    .click("form[id='stopForm'] input[type='submit']").then().pause(2000)
                    .then(function(){
                        console.log("\t　第三者割当　非稼働");
                    })
                    .url(config.context + '/PMM/ProcessModel/restart?processModelInfoId=18').then().pause(2000)
                    .then(function(){
                        console.log("\t　第三者割当");
                    })

                    .url(config.context + '/PMM/ProcessModel/stop?processModelInfoId=20').then().pause(2000)
                    .click("input[id='stopProcessInstance-true']").then().pause(2000)
                    .click("form[id='stopForm'] input[type='submit']").then().pause(2000)
                    .then(function(){
                        console.log("\t　翻訳フロー　非稼働");
                    })
                    .url(config.context + '/PMM/ProcessModel/restart?processModelInfoId=20').then().pause(2000)
                    .then(function(){
                        console.log("\t　翻訳フロー");
                    })

                    .url(config.context + '/PMM/ProcessModel/stop?processModelInfoId=21').then().pause(2000)
                    .click("input[id='stopProcessInstance-true']").then().pause(2000)
                    .click("form[id='stopForm'] input[type='submit']").then().pause(2000)
                    .then(function(){
                        console.log("\t　休暇申請フロー　非稼働");
                    })
                    .url(config.context + '/PMM/ProcessModel/restart?processModelInfoId=21').then().pause(2000)
                    .then(function(){
                        console.log("\t　休暇申請フロー");
                    })

                    .url(config.context + '/j_spring_security_logout').pause(2000)
                    .call(done);
            });
        });
*/
    });
};