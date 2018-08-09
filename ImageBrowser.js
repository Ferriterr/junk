//Image Browser 2018

var globalWindowHndl;

function DeleteImageErrorHandler(sender, e) {
    alert("The server was unable to delete the selected image(s)");
    window.location.reload(false);
}

function openpopup1(url, width, height, orderId) {
    var windowId = "upload" + orderId,
	windowOptions = "scrollbars=yes,toolbar=no,menubar=no,resizable=0,status=0,location=0,width=" + width + ",height=" + height + " ,onblur=self.focus();";
    var url = url + '?workorderID=' + orderId;
    globalWindowHndl = window.open(url, windowId, windowOptions);
}


function openpopup(url, width, height, orderId) {
    var windowId = "upload" + orderId,
		windowOptions = "menubar=0,resizable=0,status=0,location=0,width=" + width + ",height=" + height;

    globalWindowHndl = window.open(url, windowId, windowOptions);
}

function UploadImagesPopup(e) {

    if (!globalWindowHndl || globalWindowHndl.closed === true) {

        var url = 'UploadImages.aspx?OrderId=',
		    orderId = $('OrderId').value,
		    popUrl = url + orderId;

        new Ajax.Request(popUrl, {
            method: 'post',
            parameters: '',
            onFailure: takeCareofError,
            onSuccess: function checkSessionState(transport) {
                try {
                    var pageText = transport.responseText;

                    if (transport.responseText.indexOf('<meta	name="VendorWebMaster" content="VendorWebMaster" />') > -1) {
                        VendorWeb.LogOut();
                    }
                    else if (transport.responseText.indexOf('<input type="hidden" value="OrderLockedInOffice" />') > -1) {
                        location.href = "orderlocked.aspx"
                    }
                    else {
                        openpopup(popUrl, 640, 540, orderId);
                    }
                } catch (error) {
                    //alert(error.message)
                }
            }
        });

    }
    Event.stop(e);
}

function responseHandler() { }

function takeCareofError() {
    VendorWeb.LogOut();
}

function toggleSelect(e) {
    alert("toggleSelect fired");
    var el = Event.element(e),
		label = Element.childElements(el)[0].nodeValue.replace(/(^\s+|\s+$)/g, '');

    switch (label) {
        case "Select All":
            label = "Deselect All";
            remainingImages.selectAll();
            break;
        case "Deselect All":
            label = "Select All";
            remainingImages.unselectAll();
            break;
        default:
            // do nothing
    }

    Element.childElements(el)[0].nodeValue = label;
    Event.stop(e);
}

function CollapsableContainer(element) {
    var m_Element = element,
		m_Body,
		m_Caption;

    Element.childElements(m_Element).each(function (item) {
        if (Element.hasClassName(item, 'Caption') || Element.hasClassName(item, 'GrayCaption')) {
            m_Caption = item;
        }

        if (Element.hasClassName(item, 'Body')) {
            m_Body = item;
        }
    });

    Event.observe(m_Caption, 'mouseup', ClickHandler);

    function ClickHandler(e) {
        if (m_Caption.className.indexOf('Expanded') > -1) {
            Element.removeClassName(m_Caption, 'Expanded');
            Element.addClassName(m_Caption, 'Collapsed');
        }
        else {
            Element.removeClassName(m_Caption, 'Collapsed');
            Element.addClassName(m_Caption, 'Expanded');
        }

        Element.toggle(m_Body);
    }

    return {}
}

function ModifyImageSize(sliderObj, thumbObj) {
    var value = sliderObj.value();
    thumbObj.adjustThumbnailSize(value, value);
}