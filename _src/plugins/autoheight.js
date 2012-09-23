///import core
///commands 当输入内容超过编辑器高度时，编辑器自动增高
///commandsName  AutoHeight,autoHeightEnabled
///commandsTitle  自动增高
/**
 * @description 自动伸展
 * @author zhanyi
 */
UE.plugins['autoheight'] = function () {
    var me = this;
    //提供开关，就算加载也可以关闭
    me.autoHeightEnabled = me.options.autoHeightEnabled !== false ;
    if (!me.autoHeightEnabled){
        return;
    }

    var bakOverflow,
        $uew,
        doc,
        timer;
    var adjustHeight = me.adjustHeight = function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $uew.height(70)
            var dsh = doc.documentElement.scrollHeight || doc.body.scrollHeight
            if (dsh > 70) $uew.height(dsh)
        }, 50);
    }
    me.addListener('destroy', function () {
        me.removeListener('contentchange', adjustHeight);
        me.removeListener('keyup', adjustHeight);
        me.removeListener('mouseup', adjustHeight);
    });
    me.enableAutoHeight = function () {
        if(!me.autoHeightEnabled){
            return;
        }
        $uew = $(me.iframe).parent()
        doc = me.document;
        me.autoHeightEnabled = true;
        bakOverflow = doc.body.style.overflowY;
        doc.body.style.overflowY = 'hidden';
        me.addListener('contentchange', adjustHeight);
        me.addListener('keyup', adjustHeight);
        me.addListener('mouseup', adjustHeight);
        //ff不给事件算得不对
        setTimeout(function () {
            adjustHeight();
        }, browser.gecko ? 100 : 0);
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.disableAutoHeight = function () {

        me.body.style.overflowY = bakOverflow || '';

        me.removeListener('contentchange', adjustHeight);
        me.removeListener('keyup', adjustHeight);
        me.removeListener('mouseup', adjustHeight);
        me.autoHeightEnabled = false;
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.addListener('ready', function () {
        me.enableAutoHeight();
        //trace:1764
        var timer;
        domUtils.on(browser.ie ? me.body : me.document,browser.webkit ? 'dragover' : 'drop',function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                adjustHeight();
            },100);

        });
        var win = domUtils.getWindow(me.document)
        domUtils.on(win, 'scroll', function () {
            win.scrollTo(0, 0)
        })
    });






};

