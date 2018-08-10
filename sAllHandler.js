//THIS JS HANDLES SELECT ALL AND SHIT
initBuffer.add(InitializeRefreshBtn);
initBuffer.add(InitializeDownloadBtn);

function InitializeRefreshBtn() {
    var refreshBtnId = 'RefreshBtn',
        refreshElement = $(refreshBtnId);

    if (refreshElement !== null) {
        Element.show(refreshElement);
        Event.observe(refreshElement, 'click', PerformPageRefresh);
    }
}

function PerformPageRefresh() {
    var action = document.forms[0].action,
        symbol = (action.indexOf('?') > -1) ? '&' : '?';

    if (action.indexOf("IgnoreErrors=1") === -1) {
        document.forms[0].action = action + symbol + "IgnoreErrors=1&ContextID=" + leftNavRequest;
    }

    $('rLeftNavLoc').value = "OrderImages";
    document.forms[0].submit();

}
// End Refresh Button Helper Functions 

function InitializeDownloadBtn() {
    var refreshBtnId = 'DownloadBtn',
        refreshElement = $(refreshBtnId);

    if (refreshElement !== null) {
        Element.show(refreshElement);
        Event.observe(refreshElement, 'click', DownloadImages);
    }
}

function DownloadImages() {
    var url = '/Images/ImageDownloader/?workOrderID=' + $('OrderId').value;
    window.open(url, "_blank", "toolbar=0, scrollbars=0, resizable=1, top=100px, left=100px, width=700px, height=300px");
}
// End Download Images Button Helper Functions 

function GetAuxillaryImages() {
    var url = "LabelInterface.aspx?OrderId=" + $('OrderId').value,
        orderId = Browsers[globalIndex].tiedElement().id;

    if (hideGallery) {
        url += "&readonly=true";
    }

    // Get new list from Server
    new Ajax.Request(url, {
        method: 'post',
        parameters: '',
        requestHeaders: ['Accept', 'text/javascript', 'CustAction', 'GetOrderImages', 'requestOrder', orderId],
        onSuccess: PopulateAuxiallryImages
    });
}

var AuxillaryImages = [], AuxillaryImagesHandle, globalIndex = 0;
function PopulateAuxiallryImages(response) {
    eval("var responseObj =" + response.responseText);

    AuxillaryImages = responseObj;
    AuxillaryImages.reverse(); // reverse the array comes to use backwards for some odd reason.
    if (AuxillaryImages.length > 0) {
        AddAuxillaryImage();
    }

    if (AuxillaryImages.length == 0) {
        globalIndex += 1;
        if (globalIndex < Browsers.length) {
            GetAuxillaryImages();
        }
    }
}

function AddAuxillaryImage() {
    clearTimeout(AuxillaryImagesHandle);

    if (AuxillaryImages.length > 0) {
        var item = AuxillaryImages.pop();

        Browsers[globalIndex].addThumbnail(CreateThumbnail(item));

        AuxillaryImagesHandle = setTimeout('AddAuxillaryImage()', 25);
    }
    else {
        if (globalIndex < Browsers.length) {
            Browsers[globalIndex].adjustThumbnailSize(85, 85);
        }

        globalIndex += 1;
        if (globalIndex < Browsers.length) {
            GetAuxillaryImages();
        }
    }
}

function InitializeGallery(browserId, sliderId, BrowserVariable, SliderVariable, FeedMethod, watcher, thumbnailChanger) {
    if ($(browserId) !== null) {
        window[BrowserVariable] = Safeguard.Controls.ThumbnailViewer($(browserId));

        window[BrowserVariable].OnRemove(SendDeleteImageNotification);
        window[BrowserVariable].OnRemoveBatch(BatchSendDeleteImageNotification);

        var sliderElement = $(sliderId);

        if (sliderElement !== null) {
            window[SliderVariable] = Safeguard.Controls.Slider(sliderElement);
            window[SliderVariable].OnChange(thumbnailChanger);
        }
        FeedMethod();
        window.setTimeout(watcher, 50);
    }
}

function performScrollWatchTB() {
    TB.PerformScrollWatch();
    window.setTimeout(performScrollWatchTB, 50);
}

function performScrollWatchTB2() {
    TB2.PerformScrollWatch();
    window.setTimeout(performScrollWatchTB2, 50);
}

/// <summary>
/// Perform scroll watch ITB1
/// </summary>
function performScrollWatchITB1() {
    ITB1.PerformScrollWatch();
    window.setTimeout(performScrollWatchITB1, 50);
}

/// <summary>
/// Perform scroll watch ITB2
/// </summary>
function performScrollWatchITB2() {
    ITB2.PerformScrollWatch();
    window.setTimeout(performScrollWatchITB2, 50);
}

function performScrollWatchAuxilary() {
}
/// <summary>
/// Get incomplete images WO labels
/// </summary>
function GetIncompleteImagesWOLabels() {
    FireAjaxRequest('GetIncompleteImagesWOLabels', PopulateIncompleteImagesWOLabels);
}

var IncompleteImages = [], IncompleteImagesHandle;
function PopulateIncompleteImagesWOLabels(response) {
    eval("var responseObj =" + response.responseText);

    IncompleteImages = responseObj;
    IncompleteImages.reverse(); // reverse the array comes to use backwards for some odd reason.
    if (IncompleteImages.length > 0) {
        AddIncompleteImage();
    }
}

function AddIncompleteImage() {
    clearTimeout(IncompleteImagesHandle);

    if (IncompleteImages.length > 0) {
        var item = IncompleteImages.pop();

        ITB1.addThumbnail(CreateThumbnail(item));

        IncompleteImagesHandle = setTimeout('AddIncompleteImage()', 25);
    }
    else {
        ITB1.adjustThumbnailSize(85, 85);
    }
}

/// <summary>
/// Get incomplete images w labels
/// </summary>
function GetIncompleteImagesWLabels() {
    FireAjaxRequest('GetIncompleteImagesWLabels', PopulateIncompleteImagesWLabels);
}

var IncompleteImagesWLabel = [], IncompleteImagesWLabelHandle;
function PopulateIncompleteImagesWLabels(response) {
    eval("var responseObj =" + response.responseText);

    IncompleteImagesWLabel = responseObj;
    IncompleteImagesWLabel.reverse(); // reverse the array comes to use backwards for some odd reason.
    if (IncompleteImagesWLabel.length > 0) {
        AddIncompleteImageWLabel();
    }
}

function AddIncompleteImageWLabel() {
    clearTimeout(IncompleteImagesWLabelHandle);

    if (IncompleteImagesWLabel.length > 0) {
        var item = IncompleteImagesWLabel.pop();

        ITB2.addThumbnail(CreateThumbnail(item));

        IncompleteImagesWLabelHandle = setTimeout('AddIncompleteImageWLabel()', 25);
    }
    else {
        ITB2.adjustThumbnailSize(85, 85);
    }
}

/// <summary>
/// Fire ajax request
/// </summary>
/// <param name="urlAction">Url action</param>
/// <param name="succesHandler">Succes handler</param>
function FireAjaxRequest(urlAction, succesHandler) {
    var url = "MockServices.aspx?OrderId=" + $('OrderId').value;

    if (hideGallery) {
        url += "&readonly=true";
    }

    // Get new list from Server
    new Ajax.Request(url, {
        method: 'post',
        parameters: '',
        requestHeaders: ['Accept', 'text/javascript', 'CustAction', urlAction],
        onSuccess: succesHandler
    });
}

function GetLabeledImages() {
    FireAjaxRequest('GetLabeledImages', PopulateLabeledImages);
}

/// <summary>
/// Get historical images
/// </summary>
function GetHistoricalImages() {
    FireAjaxRequest('GetHistoricalImages', PopulateLabeledImages);
}

var LabeledImages = [], LabeledImagesHandle;
function PopulateLabeledImages(response) {
    eval("var responseObj =" + response.responseText);

    LabeledImages = responseObj;
    LabeledImages.reverse(); // reverse the array comes to use backwards for some odd reason.
    if (LabeledImages.length > 0) {
        AddLabeledImage();
    }
}

function AddLabeledImage() {
    clearTimeout(LabeledImagesHandle);

    if (LabeledImages.length > 0) {
        var item = LabeledImages.pop();

        TB2.addThumbnail(CreateThumbnail(item));

        LabeledImagesHandle = setTimeout('AddLabeledImage()', 25);
    }
    else {
        TB2.adjustThumbnailSize(85, 85);
    }
}

function GetAvailableImages() {
    FireAjaxRequest('GetImages', PopulateAvailableImages);
}

function GetCompletedAvailableImages() {
    FireAjaxRequest('GetCompletedImages', PopulateAvailableImages);
}

var AvailableImages = [], AvailableImagesHandle;
function PopulateAvailableImages(response) {
    eval("var responseObj =" + response.responseText);

    AvailableImages = responseObj;
    AvailableImages.reverse(); // reverse the array comes to use backwards for some odd reason.
    if (AvailableImages.length > 0) {
        allowAvailableImageInteraction = false;
        AddAvailableImage();
    }
}
var allowAvailableImageInteraction = true;
function AddAvailableImage() {
    clearTimeout(AvailableImagesHandle);

    if (AvailableImages.length > 0) {
        var item = AvailableImages.pop();
        TB.addThumbnail(CreateThumbnail(item));
        AvailableImagesHandle = setTimeout('AddAvailableImage()', 25);
    }
    else {
        TB.adjustThumbnailSize(85, 85);
        allowAvailableImageInteraction = true;
    }
}

function CreateThumbnail(ImageDocument) {
    var li = document.createElement("li"),
        img = document.createElement("img");

    li.appendChild(img);

    dateInMilliSecs = parseInt(ImageDocument.CreateDate.substring(6, ImageDocument.CreateDate.length - 2));
    dateObj = new Date();
    dateObj.setTime(dateInMilliSecs);

    // Added attribute ID
    Element.writeAttribute(img, {
        src: page.Settings.ImageHandlerRoot + "ImageHandler.ashx?id=" + ImageDocument.ContentId + "&isThumbnail=1",
        imgSrc: page.Settings.ImageHandlerRoot + "ImageHandler.ashx?id=" + ImageDocument.ContentId + "&isThumbnail=1",
        createDate: formatDate(dateObj),
        width: "95",
        height: "71",
        doctype: ImageDocument.DocType,
        draggable:"false",
        id: ImageDocument.ContentId //Added attribute ID
    });

    return li;
}

function formatDate(DateObj) {
    ampm = " AM";
    month = DateObj.getMonth();
    month++;
    day = DateObj.getDate();
    year = DateObj.getFullYear();

    hours = DateObj.getHours();
    if (hours > 12) {
        hours = hours - 12;
        ampm = " PM";
    }

    minutes = DateObj.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    seconds = DateObj.getSeconds();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds + ampm;
}

/// <summary>
/// Is interaction allowed
/// </summary>
/// <param name="message">Message</param>
/// <param name="functionPointer">Function pointer</param>
function IsInteractionAllowed(message, functionPointer, e) {
    if (allowAvailableImageInteraction) {
        functionPointer;
    }
    else {
        alert(message);
        Event.stop(e);
    }
}

// Order Images Utility functions
function DeleteSelectedImages(e) {
    IsInteractionAllowed(uiPendingMessage, DeleteHandler(e, 'TB'), e);
}

/// <summary>
/// Delete inc selected images
/// </summary>
/// <param name="e">E</param>
function DeleteIncSelectedImages(e) {
    DeleteHandler(e, 'ITB1');
}

/// <summary>
/// Delete handler
/// </summary>
/// <param name="e">E</param>
/// <param name="browser">Browser</param>
function DeleteHandler(e, browser) {
    if (confirm('Are you sure you want to delete the selected image(s)?') == true) {
        var imgBrowser = window[browser],
            count,
            threshHoldLimit = 400;

        if (imgBrowser == null) {
            return;
        }

        count = imgBrowser.GetSelectedCount();
        if (count <= threshHoldLimit) {
            imgBrowser.removeSelected();
        }
        else {
            RequestPopup.Open();
            currentBrowserInBatch = imgBrowser;
            RemoveImagesInBatch();
        }
    }

    Event.stop(e);
}

var currentBrowserInBatch = null,
    batchSize = 100;

/// <summary>
/// Remove images in batch
/// </summary>
function RemoveImagesInBatch() {
    if (currentBrowserInBatch.GetSelectedCount() > 0) {
        currentBrowserInBatch.RemoveSelectedBatch(batchSize);
    }
    else {
        RequestPopup.Close();
    }
}

var uiPendingMessage = "The image gallery is still populating with images, please wait till it is completed.";
function SelectAll(e) {
    IsInteractionAllowed(uiPendingMessage, SelectAllHandler(e, 'TB'), e);
}

function SelecInctAll(e) {
    SelectAllHandler(e, 'ITB1');
}

/// <summary>
/// Select all handler
/// </summary>
/// <param name="e">E</param>
/// <param name="browser">Browser</param>
function SelectAllHandler(e, browser) {
    var el = Event.element(e),
		label = el.childNodes[0].nodeValue.replace(/(^\s+|\s+$)/g, '');

    switch (label) {
        case "Select All Images":
            label = "Deselect All Images";
            window[browser].selectAll();
            break;
        case "Deselect All Images":
            label = "Select All Images";
            window[browser].unselectAll();
            break;
        default:
            // do nothing
    }

    el.childNodes[0].nodeValue = label;
    Event.stop(e);
}

function ChangeThumbnailSize() {
    ModifyImageSize(slider1, TB);
}

function ChangeThumbnailSize2() {
    ModifyImageSize(slider2, TB2);
}

function ChangeThumbnailSize3() {
    ModifyImageSize(slider3, ITB1);
}

function ChangeThumbnailSize4() {
    ModifyImageSize(slider4, ITB2);
}

function SendDeleteImageNotification(imageIds) {
    if (page.Settings.ThumbnailBrowser !== null) {
        var IMAGE_DELETE_URL = 'FilerServices/deleteimages.aspx',
		    workOrderId = $('OrderId').value;

        page.Settings.ThumbnailBrowser.selectThumbnailByIds(imageIds);

        if (imageIds.length > 0) {
            new Ajax.Request(IMAGE_DELETE_URL, {
                method: 'post',
                parameters: '',
                requestHeaders: '',
                postBody: 'WorkOrderId=' + workOrderId + '&ImageIds=' + imageIds.join(','),
                onFailure: DeleteImageErrorHandler,
                onSuccess: CleanUI
            });
        }
    }
    else {
        parent.Application.SendDeleteImageNotification(imageIds);
    }
}

/// <summary>
/// Batch send delete image notification
/// </summary>
/// <param name="imageIds">Image ids</param>
function BatchSendDeleteImageNotification(imageIds) {
    if (page.Settings.ThumbnailBrowser !== null) {
        var IMAGE_DELETE_URL = 'FilerServices/deleteimages.aspx',
		    workOrderId = $('OrderId').value;

        page.Settings.ThumbnailBrowser.selectThumbnailByIds(imageIds);

        if (imageIds.length > 0) {
            new Ajax.Request(IMAGE_DELETE_URL, {
                method: 'post',
                parameters: '',
                requestHeaders: '',
                postBody: 'WorkOrderId=' + workOrderId + '&ImageIds=' + imageIds.join(','),
                onFailure: DeleteImageErrorHandler,
                onSuccess: RemoveImagesInBatch
            });
        }
    }
    else {
        parent.Application.BatchSendDeleteImageNotification(imageIds, RemoveImagesInBatch);
    }
}

function CleanUI() {
    if (page.Settings.ThumbnailBrowser !== null) {
        page.Settings.ThumbnailBrowser.removeSelected();
    }
    else {
        parent.Application.RemoveSelected();
    }
}

function refreshBrowsers() {
    var postBody,
		url = "MockServices.aspx?OrderId=" + $('OrderId').value,
	    currentSerializedList = TB.returnVisiableThumbnailIds(),
	    currentSerializedList2 = TB2.returnVisiableThumbnailIds(),
	    concatedArray = [];

    concatedArray = concatedArray.concat(currentSerializedList, currentSerializedList2);

    postBody = "omitArray=" + JSON.stringify(concatedArray);

    // Get new list from Server
    new Ajax.Request(url, {
        method: 'post',
        parameters: '',
        requestHeaders: ['Accept', 'text/javascript', 'CustAction', 'GetImages'],
        postBody: postBody,
        onSuccess: appendUploadedImagesOIPage
    });
}

var OIPageArray = [], thumbnailHandlerOIP;
function appendUploadedImagesOIPage(response) {
    eval("var responseObj =" + response.responseText);

    OIPageArray = responseObj;
    OIPageArray.reverse(); // reverse the array comes to use backwards for some odd reason.
    if (OIPageArray.length > 0) {
        UpdateOrderImagesOPI();
    }
}

function UpdateOrderImagesOPI() {
    clearTimeout(thumbnailHandlerOIP);

    if (OIPageArray.length > 0) {
        var item = OIPageArray.pop();

        TB.addThumbnail(CreateThumbnail(item));

        if (page.Settings.ThumbnailBrowser !== null) {
            page.Settings.ThumbnailBrowser.addThumbnail(li);
        }
        else {
            parent.Application.AddItems(item);
        }

        thumbnailHandlerOIP = setTimeout('UpdateOrderImagesOPI()', 25);
    }
    else {
        TB.adjustThumbnailSize(85, 85);

        if (page.Settings.ThumbnailBrowser !== null) {
            var dimensions = page.Settings.ThumbnailBrowser.ThumbnailDimensions();

            page.Settings.ThumbnailBrowser.adjustThumbnailSize(dimensions['thumbnailWidth'], dimensions['thumbnailHeight']);
        }
        else {
            //var dimensions = parent.Application.ThumbnailDimensions();

            //parent.Application.AdjustThumbnailSize( dimensions['thumbnailWidth'], dimensions['thumbnailHeight'] );
        }
    }
}

