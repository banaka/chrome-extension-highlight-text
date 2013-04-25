// ==UserScript==
// @name          Quan and Hung's highlight text
// @namespace     
// @include       *
// ==/UserScript==


function getSelectionParsedHtml() {
	var html = "";
	if ( typeof window.getSelection != "undefined") {
		var sel = window.getSelection();
		if (sel.rangeCount) {
			var container = document.createElement("div");
			for (var i = 0, len = sel.rangeCount; i < len; ++i) {
				container.appendChild(sel.getRangeAt(i).cloneContents());
			}
			html = container.innerHTML;
		}
	} else if ( typeof document.selection != "undefined") {
		if (document.selection.type == "Text") {
			html = document.selection.createRange().htmlText;
		}
	}
	return html;
}

function getSelectionHtml() {
	var text = getSelectionParsedHtml();
	var source = document.body.innerHTML;
	source = source.replace(/\s+</g, "<");
	source = source.replace(/>\s+/g, ">");
	text = text.replace(/\s+</g, "<");
	text = text.replace(/>\s+/g, ">");
	var origin = text;
	if (source.search(text) >= 0) {
		return text;
	}
	i = 0;
	if (text.charAt(i) == '<') {
		while (i < text.length && text.charAt(i) == '<') {
			while (i < text.length && text.charAt(i) != '>') {
				i++;
			}
			i++;
		}
	} else {
		return text;
	}

	text = text.substring(i, text.length);
	if (source.search(text) >= 0) {
		return text;
	}
	i = text.length - 1;
	while (i > 0 && text.charAt(i) == '>') {
		while (i > 0 && text.charAt(i) != '<') {
			i--;
		}
		text = text.substring(0, i);
		if (source.search(text) >= 0) {
			return text;
		}
		i--
	}
	return origin;
}

function replaceSelectionWithHtml(oriDoc, oriSel, html) {
	oriDoc = oriDoc.replace(/\s+</g, "<");
	oriDoc = oriDoc.replace(/>\s+/g, ">");
	oriSel = oriSel.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
	pattern = new RegExp(oriSel, 'g');
	html = html.replace(/\$/g, '$$$$');
	newDoc = oriDoc.replace(pattern, html);
	document.body.innerHTML = newDoc;
}

function styleHTML(text) {
	result = '';
	content = '';
	i = 0;
	start = 0;
	end = 0;
	while (i < text.length) {
		tag = '';
		start = i;
		while (i < text.length && text.charAt(i) != '<') {
			i++;
		}
		end = i;
		content = text.substring(start, end);
		while (i < text.length && text.charAt(i) == '<') {
			while (i < text.length && text.charAt(i) != '>') {
				i++;
			}
			i++;
		}
		tag = text.substr(end, i - end);
		result = result.concat('<span style="background: yellow;">').concat(content).concat('</span>').concat(tag);
	}
	return result;
}


window.onmouseup = function(e) {
	if (e.ctrlKey && e.altKey) {
		var htmlText = getSelectionHtml();
		var styledText = styleHTML(htmlText);
		var oriDoc = document.body.innerHTML;
		replaceSelectionWithHtml(oriDoc, htmlText, styledText);
	}
}
