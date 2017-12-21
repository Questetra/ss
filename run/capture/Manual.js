const webdriverio = require('webdriverio');
const fs = require('fs');

const Annotation = require('./captureAnnotation.js').Annotation;
const cAnoColors = require('./captureAnnotation.js').COLORS;
const cAnoPosition = require('./captureAnnotation.js').POSITION;

console.log(Annotation);

const nowDate = new Date();

/*
var config = {
    url: 'https://template.questetra.net/Login_show',
    deprecationWarnings: false,
    context: "https://horikawa-sanjo-216.questetra.net/",
    qusers: {
        admin: {
            mail: "yamamoto+capture01@questetra.com",
            password: "173w5354q"
        },
        tasker: {
            mail: "yamamoto+capture02@questetra.com",
            password: "173w5354q"
        }
    }
};
*/
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

function checkFlash() {
    //var $ = jQuery;
    return true;
}

// http://webdriver.io/api.html

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

        describe('Login > Flash有効化 > Logout', () => {
            it('is OK', function(done) {
                this.timeout(30000);
                client
                    .url(config.context + "/Login_show")
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

        describe('タスクの生成', () => {
            it('is OK', function(done) {
                this.timeout(60000);
                client
                    .url(config.context + "/Login_show")
                    .setValue('input[name=j_username]', config.qusers.tasker.mail)
                    .setValue('input[name=j_password]', config.qusers.tasker.password)
                    .click('input[class=login-submit]').pause(2000)
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
                    // 期限内のタスクを生成
                    .url(config.context + '/PE/ProcessModel/listView').then().pause(2000)
                    .click("a[href^='/PE/ProcessInstance/startAndExecute?processModelInfoId=4']").pause(2000)

                    .setValue("input[name='data[3].dummy']", "太").then()
                    .scroll("input[name='data[3].dummy']", 0, -100)
                    .execute(Annotation.rectangle, "input[name='data[3].dummy']", {
                        text: "ユーザ型データ",
                        position: cAnoPosition.RIGHT
                    }, cAnoColors[0], null, null, [5,5,20,70]).then()
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
                    .url(config.context + '/j_spring_security_logout').pause(2000)
                    .call(done);
            });
        });
        /*
                describe('Login > Google連携/SAML連携　無効化 > Logout > M101-2', () => {
                    it('is OK', function(done) {
                        this.timeout(20000);
                        client
                            // Login
                            .url(config.context + "/Login_show")
                            .setValue('input[name=j_username]', config.qusers.admin.mail)
                            .setValue('input[name=j_password]', config.qusers.admin.password)
                            .click('input[class=login-submit]')
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
        describe('Login > Google連携/SAML連携　有効化 > Logout > M101-3 > Login > Google連携/SAML連携　無効化 > Logout > M101-2', () => {
            it('is OK', function(done) {
                this.timeout(30000);
                client
                    //  Google連携/SAML連携　有効化
                    //Login
                    .url(config.context + "/Login_show")
                    .setValue('input[name=j_username]', config.qusers.admin.mail)
                    .setValue('input[name=j_password]', config.qusers.admin.password)
                    .click('input[class=login-submit]')
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
                    .url(config.context + "/Login_show")
                    .setValue('input[name=j_username]', config.qusers.admin.mail)
                    .setValue('input[name=j_password]', config.qusers.admin.password)
                    .click('input[class=login-submit]')
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

        describe('Login', () => {
            it('is OK', function(done) {
                this.timeout(10000);
                client
                    .setValue('input[name=j_username]', config.qusers.admin.mail)
                    .setValue('input[name=j_password]', config.qusers.admin.password)
                    .click('input[class=login-submit]').pause(2000).then()
                    .call(done);
            });
        });

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
                    },cAnoColors[1]).then()
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
                    .url(config.context + '/PMM/ProcessModel/view?processModelInfoId=4')
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
                    .saveScreenshot(makePathFlat('M201-3', 'manual'))
                    .execute(Annotation.clear).then()

                    .call(done);
            });
        });

        describe('M202-2', () => {
            it('is OK', function(done) {
                this.timeout(100000);
                client
                    .url(config.context + '/PE/Workitem/list').then()
                    .execute(Annotation.rectangle, "span[class='errorMessage']", {
                        text: "[マイタスク]の締め切り表示",
                        position: cAnoPosition.TOP_LEFT
                    }, cAnoColors[0], null, null, [15, 5, 5, 5]).then()
                    .execute(Annotation.title, cAnoPosition.BOTTOM_LEFT, "[マイタスク]の締め切り表示").then(function(ret) {
                        console.log("\t\t" + ret.value.join("\n\t\t")); // outputs: 10
                    }).then()
                    .saveScreenshot(makePathFlat('M202-2', 'manual'))
                    .execute(Annotation.clear).then()
                    .call(done);
            });
        });
        /*
                                        describe('PMM ProcessModel showUpload', () => {
                                            it('is OK', function(done) {
                                                this.timeout(100000);
                                                client
                                                    .click("span[class='start']")
                                                    .pause(2000).then()
                                                    .scroll(".tform-action", 0 ,0)
                                                    .execute(addNote, {
                                                        text: "処理者に経路選択させる方式",
                                                        position: "top-right"
                                                    }, [{
                                                            type: "rectangle",
                                                            target: ".tform-action",
                                                            option: {
                                                                padding: [0, 0, 52, 52]
                                                            }
                                                        },
                                                    ]).then(function(ret) {
                                                        console.log(ret.value);
                                                    })
                                                    .saveScreenshot(joinOutputPath('M203-3'))
                                                    .execute(removeNote).then(function(ret) {
                                                        console.log(ret.value);
                                                    })
                                                    .call(done);
                                            });
                                        }); 


        describe('210-3', () => {
            it('is OK', function(done) {
                this.timeout(100000);
                client
                    .scroll("input[name='data[7].dummy']", 0, -300)
                    .setValue("input[name='data[7].dummy']", 'j')
                    .pause(1000).then()
                    .execute(addNote, {
                        text: "ユーザ型データ参照",
                        position: "top-right"
                    }, [{
                        type: "rectangle",
                        target: "input[name='data[7].dummy']",
                        option: {
                            padding: [20, 20, 200, 100]
                        }
                    }, ]).then(function(ret) {
                        console.log(ret.value);
                    })
                    .saveScreenshot(joinOutputPath('M210-3'))
                    .execute(removeNote).then(function(ret) {
                        console.log(ret.value);
                    })
                    .call(done);
            });
        });

                                                describe('210-4', () => {
                                                    it('is OK', function(done) {
                                                        this.timeout(100000);
                                                        client
                                                            .click("a[href='/PE/Workitem/list']")
                                                            .pause(5000).then()
                                                            .click("span[class='detail']")
                                                            .pause(5000).then()
                                                            .scroll("#title-workitem", 0 ,0)
                                                            .saveScreenshot(joinOutputPath('M210-4'))
                                                            .execute(removeNote).then(function(ret) {
                                                                console.log(ret.value);
                                                            })
                                                            .call(done);
                                                    });
                                                });

                                                describe('210-4', () => {
                                                    it('is OK', function(done) {
                                                        this.timeout(100000);
                                                        client
                                                            .url('hhttps://template.questetra.net/PMM/ProcessModel/view?processModelInfoId=277')
                                                            .click("span[class='detail']")
                                                            .pause(5000).then()
                                                            .scroll("#title-workitem", 0 ,0)
                                                            .saveScreenshot(joinOutputPath('M210-4'))
                                                            .execute(removeNote).then(function(ret) {
                                                                console.log(ret.value);
                                                            })
                                                            .call(done);
                                                    });
                                                });
                                        */


        describe('プロセス消去', () => {
            it('is OK', function(done) {
                this.timeout(30000);
                client
                    .url(config.context + '/j_spring_security_logout').pause(2000).then()
                    .url(config.context + "/Login_show").then()
                    .setValue('input[name=j_username]', config.qusers.admin.mail)
                    .setValue('input[name=j_password]', config.qusers.admin.password)
                    .click('input[class=login-submit]')
                    .pause(2000).then()
                    // 無効か
                    .url(config.context + '/PMM/ProcessModel/stop?processModelInfoId=4').then()
                    .click("input[id='stopProcessInstance-true']").then()
                    .click("form[id='stopForm'] input[type='submit']").then()
                    .url(config.context + '/PMM/ProcessModel/restart?processModelInfoId=4').then()
                    .url(config.context + '/j_spring_security_logout').pause(2000)
                    .call(done);
            });
        });

    });
};