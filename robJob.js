var TB, TB2, ITB1, ITB2,
    Browsers = [],
    imageHandlerRoot = 'https://vnet.safeguardproperties.com/upload/',
    slider1 = null,
    slider2 = null,
    slider3 = null,
    slider4 = null,
    TBTimeout, TB2Timeout,
    isLegacy = false;

// Used to add function calls after Dom is available
hideGallery = false;

page.AddOnInitialize(initializeOrderImagesPage);

function initializeOrderImagesPage() {
    if (isLegacy === true) {
        InitializeGallery('UsedThumbnailViewer', 'slider2', 'TB2', 'slider2', GetHistoricalImages, performScrollWatchTB2, ChangeThumbnailSize2);
    } else {
        InitializeGallery('ThumbnailViewer2', 'slider', 'TB', 'slider1', GetCompletedAvailableImages, performScrollWatchTB, ChangeThumbnailSize);
        InitializeGallery('UsedThumbnailViewer', 'slider2', 'TB2', 'slider2', GetLabeledImages, performScrollWatchTB2, ChangeThumbnailSize2);
        InitializeGallery('IncompleteWOLabels', 'slider3', 'ITB1', 'slider3', GetIncompleteImagesWOLabels, performScrollWatchITB1, ChangeThumbnailSize3);
        InitializeGallery('IncompleteWLabels', 'slider4', 'ITB2', 'slider4', GetIncompleteImagesWLabels, performScrollWatchITB2, ChangeThumbnailSize4);
    }

    if (hideGallery === false) {
        Event.observe($('DeleteImages'), 'mouseup', DeleteSelectedImages);
        Event.observe($('SelectAll'), 'mouseup', SelectAll);

        try {
            Event.observe($('Upload'), 'mouseup', UploadImagesPopup);
        } catch (err) {}


        try {
            Event.observe($('JQUpload'), 'mouseup', UploadImagesPopup1);
        } catch (err) {}



        Event.observe($('incDelete'), 'mouseup', DeleteIncSelectedImages);
        Event.observe($('incSelect'), 'mouseup', SelecInctAll);
        Event.observe($('incUpload'), 'mouseup', UploadImagesPopup);
    }

    $$('.Collapsable').each(function(element) {
        CollapsableContainer(element);
    });

    $$('.ThumbnailBrowser').each(function(element) {
        if (element.id !== 'ThumbnailViewer2' &&
            element.id !== 'UsedThumbnailViewer' &&
            element.id !== 'IncompleteWOLabels' &&
            element.id !== 'IncompleteWLabels') {

            var browser = Safeguard.Controls.ThumbnailViewer(element);
            Browsers.push(browser);
        }
    });

    GetAuxillaryImages();
    window.setTimeout(performScrollWatchAuxilary, 50);
    document.forms[0].action = (hideGallery === false) ?
        'OrderImages.aspx' :
        'OrderImages.aspx?readonly=true';

}


function UploadImagesPopup1(e) {
    e.stopPropagation() // stops collapse of div
    var ImageRoot = 'https://vnet.safeguardproperties.com/upload/';
    var url = ImageRoot + 'Upload/FileUploaderJQ/FileUploader1.aspx';
    var url = '../../Upload/FileUploaderJQ/FileUploader1.aspx';
    orderId = $('OrderId').value;
    popUrl = url;
    openpopup1(popUrl, 780, 750, orderId);
}

function PrevFullSize() {
    var ImgIDarray = [];
    var ImgURLarray = [];
    var ImgMobileLabel = [];
    var OrigImgHeight = [];
    var OrigImgWidth = [];
    var DocTypes = [];
    var CurURL = '';
    var categoryData = '';
    var labelDescription = '';

    var ss = document.getElementById("fullSizeImageDIV").getElementsByTagName("img")
    var x = parent.document.getElementById('FilmStrip').contentWindow.document.getElementById("Fstrip");
    var Fimgs = x.getElementsByTagName('img'); // get all thumbs 
    var CurID = ss[0].id.substr(1);

    // Make arrays of thumbIDs and there URL's
    for (var i = 0; i < Fimgs.length; i++) {
        if (Fimgs[i].id !== ss[0].id && Fimgs[i].id.length !== 0) {
            var filename = Element.readAttribute(Fimgs[i], 'filename');

            parts = filename.split("~");

            if (parts.length >= 2) {
                categoryData = parts[0];
                fileParts = parts[1].split(".");
                labelDescription = fileParts[0];
            }

            if (parts.length == 1) {
                fileParts = parts[0].split(".");
                categoryData = fileParts[0];
                labelDescription = '';
            }

            var ext = filename.split('.').pop();
            if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
                ImgIDarray.push(Fimgs[i].id);
                ImgURLarray.push(Fimgs[i].src.replace("Thumbnail=1", "Thumbnail=0"));

                if (categoryData.length > 0) {
                    ImgMobileLabel.push(categoryData + '<br/>' + labelDescription);
                }

                var docType = Element.readAttribute(Fimgs[i], 'doctype');
                DocTypes.push(docType);
                var origimgheight = Element.readAttribute(Fimgs[i], 'origimageheight');
                OrigImgHeight.push(origimgheight);
                var origimgwidth = Element.readAttribute(Fimgs[i], 'origimagewidth');
                OrigImgWidth.push(origimgwidth);
            }
        }
    }

    for (var i = 0; i < ImgIDarray.length; i++) {
        if (ImgIDarray[i] == CurID) {
            if (i - 1 >= 0) {
                jQuery('#fullSizeImageDIV').html(''); // Empty the full size image div

                try {
                    if (categoryData.length > 0) {
                        jQuery(window.parent.frames[0].document.getElementById("mobilePhotoLabel")).html(ImgMobileLabel[i - 1]); // populate the category and label description
                    } else {
                        jQuery(window.parent.frames[0].document.getElementById("mobilePhotoLabel")).html(''); // populate the category and label description
                    }
                } catch (err) {}

                var img = document.createElement('img');
                img.id = 'E' + ImgIDarray[i - 1];
                img.src = ImgURLarray[i - 1];
                var origWidth = OrigImgWidth[i - 1];
                var origHeight = OrigImgHeight[i - 1];
                var imageID = ImgIDarray[i - 1];
                var docType = DocTypes[i - 1];
                if (docType === "Panoramic") {
                    img.onclick = function() { showPanaormicImage(imageID, origWidth, origHeight); };
                    img.onmouseover = function() { this.style.cursor = 'pointer' };
                }
                if (document.body.contains(document.getElementById("videoPLayIconDivId"))) {
                    document.getElementById("videoPLayIconDivId").remove();
                }
                if (docType === "Video") {
                    img.onclick = function() { playVideo(imageID, origWidth, origHeight); };
                    img.onmouseover = function() { this.style.cursor = 'pointer' };
                    var videoPLayIconDiv = document.createElement('div');
                    videoPLayIconDiv.className = 'VideoPlayIconFullSizeOverlay';
                    videoPLayIconDiv.id = 'videoPLayIconDivId';
                    videoPLayIconDiv.onclick = function() { playVideo(imageID, origWidth, origHeight); };
                    videoPLayIconDiv.onmouseover = function() { this.style.cursor = 'pointer' };
                    var fullsizeImgDiv = document.getElementById("fullSizeImageDIV");
                    insertAfter(videoPLayIconDiv, fullsizeImgDiv);
                }
                img.style.cssText = "width: 95%; height: 95%;";
                img.draggable = true;
                x = document.getElementById("fullSizeImageDIV");
                x.appendChild(img);
            } else {
                alert('You are at the First Image');
            }
        }
    }
}

function NextFullSize() {
    var ImgIDarray = [];
    var ImgURLarray = [];
    var ImgMobileLabel = [];
    var OrigImgHeight = [];
    var OrigImgWidth = [];
    var DocTypes = [];
    var CurURL = '';
    var ss = document.getElementById("fullSizeImageDIV").getElementsByTagName("img")
    var x = parent.document.getElementById('FilmStrip').contentWindow.document.getElementById("Fstrip");
    var Fimgs = x.getElementsByTagName('img'); // get all thumbs in Expanded
    var CurID = ss[0].id.substr(1);
    var categoryData = '';
    var labelDescription = '';

    //make arrays of thumb IDs and there URL's
    for (var i = 0; i < Fimgs.length; i++) {
        if (Fimgs[i].id !== ss[0].id && Fimgs[i].id.length !== 0) {

            var filename = Element.readAttribute(Fimgs[i], 'filename');

            parts = filename.split("~");

            if (parts.length >= 2) {
                categoryData = parts[0];
                fileParts = parts[1].split(".");
                labelDescription = fileParts[0];
            }

            if (parts.length == 1) {
                fileParts = parts[0].split(".");
                categoryData = fileParts[0];
                labelDescription = '';
            }

            var ext = filename.split('.').pop();
            if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
                ImgIDarray.push(Fimgs[i].id);
                ImgURLarray.push(Fimgs[i].src.replace("Thumbnail=1", "Thumbnail=0"));
                if (categoryData.length > 0) {
                    ImgMobileLabel.push(categoryData + '<br/>' + labelDescription);
                }
                var docType = Element.readAttribute(Fimgs[i], 'doctype');
                DocTypes.push(docType);
                var origimgheight = Element.readAttribute(Fimgs[i], 'origimageheight');
                OrigImgHeight.push(origimgheight);
                var origimgwidth = Element.readAttribute(Fimgs[i], 'origimagewidth');
                OrigImgWidth.push(origimgwidth);
            }
        }
    }

    for (var i = 0; i < ImgIDarray.length; i++) {
        if (ImgIDarray[i] == CurID) {
            if (i + 1 < ImgIDarray.length) {
                jQuery('#fullSizeImageDIV').html(''); // Empty the div

                try {
                    if (categoryData.length > 0) {
                        jQuery(window.parent.frames[0].document.getElementById("mobilePhotoLabel")).html(ImgMobileLabel[i + 1]); // populate the category and label description
                    } else {
                        jQuery(window.parent.frames[0].document.getElementById("mobilePhotoLabel")).html(''); // populate the category and label description
                    }
                } catch (err) {}

                var img = document.createElement('img');
                img.id = 'E' + ImgIDarray[i + 1];
                img.src = ImgURLarray[i + 1];
                var origWidth = OrigImgWidth[i + 1];
                var origHeight = OrigImgHeight[i + 1];
                var imageID = ImgIDarray[i + 1];
                var docType = DocTypes[i + 1];
                if (docType === "Panoramic") {
                    img.onclick = function() { showPanaormicImage(imageID, origWidth, origHeight); };
                    img.onmouseover = function() { this.style.cursor = 'pointer' };
                }

                if (document.body.contains(document.getElementById("videoPLayIconDivId"))) {
                    document.getElementById("videoPLayIconDivId").remove();
                }
                if (docType === "Video") {
                    img.onclick = function() { playVideo(imageID, origWidth, origHeight); };
                    img.onmouseover = function() { this.style.cursor = 'pointer' };
                    var videoPLayIconDiv = document.createElement('div');
                    videoPLayIconDiv.className = 'VideoPlayIconFullSizeOverlay';
                    videoPLayIconDiv.id = 'videoPLayIconDivId';
                    videoPLayIconDiv.onclick = function() { playVideo(imageID, origWidth, origHeight); };
                    videoPLayIconDiv.onmouseover = function() { this.style.cursor = 'pointer' };
                    var fullsizeImgDiv = document.getElementById("fullSizeImageDIV");
                    insertAfter(videoPLayIconDiv, fullsizeImgDiv);
                }
                img.style.cssText = "width: 95%; height: 95%;";
                img.draggable = true;
                x = document.getElementById("fullSizeImageDIV");
                x.appendChild(img);
            } else {
                alert('You are at the Last Image');
            }
        }
    }
}

function showPanaormicImage(contentid, imagewidth, imageheight) {
    var panoramicDisplay = '/PanoramicDisplay?imageId=' + contentid + '&imageWidth=' + imagewidth + '&imageHeight=' + imageheight;
    var OpenWindow = window.open(panoramicDisplay, '_blank', 'toolbar=0, top=100px, left=100px, width=700, height=500, resizable=1');
}

function playVideo(contentid, origWidth, origHeight) {
    var videoPlayer = '/VideoPlayer/Play/' + contentid;
    var OpenWindow = window.open(videoPlayer, '_blank', 'toolbar=0, top=100px, left=100px, width=' + origWidth + ', height=' + origHeight + ', resizable=1');
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}