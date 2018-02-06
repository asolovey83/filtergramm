var imgsource;
var imgorigin;
var imggrey;
var imgred;
var imgrainbow;
var imgcross;
var imgsine;
var imgblur;
var canvas;


function imgupload() {
	imgsource = document.getElementById("imginput");
	canvas = document.getElementById("imgcnv");
	imgorigin = new SimpleImage(imgsource);
	imggrey = new SimpleImage(imgsource);
	imgred = new SimpleImage(imgsource);
	imgrainbow = new SimpleImage(imgsource);
	imgcross = new SimpleImage(imgsource);
	imgsine = new SimpleImage(imgsource);
	imgblur = new SimpleImage(imgsource);
	imgorigin.drawTo(canvas);
}

function makeGrey() {

	if (imageIsLoaded(imggrey)) {
		filterGrey();
		imggrey.drawTo(canvas);
	}

}

function makeBlur() {
	if (imageIsLoaded(imgblur)) {
		filterBlur();
		imgblur.drawTo(canvas);
	}
}

function makeRed() {

	if (imageIsLoaded(imgred)) {
		filterRed();
		imgred.drawTo(canvas);
	}

}

function makeCross() {

	if (imageIsLoaded(imgcross)) {
		filterCross();
		imgcross.drawTo(canvas);
	}

}

function makeRainbow() {

	if (imageIsLoaded(imgrainbow)) {
		filterRainbow();
		imgrainbow.drawTo(canvas);
	}
}

function makeSine() {

	if (imageIsLoaded(imgsine)) {
		filterSine();
		imgsine.drawTo(canvas);
	}
}

function imgReset() {

	imgsource = document.getElementById("imginput");
	imgorigin = new SimpleImage(imgsource);
	imgorigin.drawTo(canvas);
	imggrey = imgorigin;
	imgred = imgorigin;
	imgrainbow = imgorigin;
	imgcross = imgorigin;
	imgsine = imgorigin;
	imgblur = imgorigin;

}

function imageIsLoaded(img) {
	if (img.complete) {
		return true;
	} else {
		return false;
	}
}

function filterGrey() {
	for (var pixel of imggrey.values()) {
		var avg = (pixel.getGreen() + pixel.getRed() + pixel.getBlue()) / 3;
		pixel.setBlue(avg);
		pixel.setGreen(avg);
		pixel.setRed(avg);
	}
}

function filterRed() {
	for (var pixel of imgred.values()) {
		var avg = (pixel.getGreen() + pixel.getRed() + pixel.getBlue()) / 3;

		if (avg < 128) {
			pixel.setRed(avg * 2);
			pixel.setGreen(0);
			pixel.setBlue(0);
		} else {
			pixel.setRed(255);
			pixel.setGreen((avg * 2) - 255);
			pixel.setBlue((avg * 2) - 255);
		}

	}
}

function filterCross() {
	for (var pixel of imgcross.values()) {
		if ((pixel.getX() > imgcross.width / 2 - 5 && pixel.getX() < imgcross.width / 2 + 5) ||
			(pixel.getY() > imgcross.height / 2 - 10 && pixel.getY() < imgcross.height / 2 + 10) ||
			pixel.getX() < 10 || pixel.getY() < 10 || pixel.getX() > imgcross.width - 10 ||
			pixel.getY() > imgcross.height - 10) {
			pixel.setRed(255);
			pixel.setGreen(255);
			pixel.setBlue(255);
		}

	}
}

function filterRainbow() {
	for (var pixel of imgrainbow.values()) {

		var avg = (pixel.getGreen() + pixel.getRed() + pixel.getBlue()) / 3;

		if (pixel.getY() <= imgrainbow.height / 4) {

			if (avg < 128) {
				pixel.setRed(avg * 2);
				pixel.setGreen(0);
				pixel.setBlue(0);
			} else {
				pixel.setRed(255);
				pixel.setGreen((avg * 2) - 255);
				pixel.setBlue((avg * 2) - 255);
			}
		} else if (pixel.getY() > imgrainbow.height / 4 && pixel.getY() <= imgrainbow.height / 2) {
			if (avg < 128) {
				pixel.setRed(avg * 2);
				pixel.setGreen(0.8*avg);
				pixel.setBlue(0);
			} else {
				pixel.setRed(255);
				pixel.setGreen(1.2*avg - 51);
				pixel.setBlue((avg * 2) - 255);
			}
		} else if (pixel.getY() > imgrainbow.height / 2 && pixel.getY() <= (imgrainbow.height / 4) * 3) {
			if (avg < 128) {
				pixel.setRed(0);
				pixel.setGreen(avg * 2);
				pixel.setBlue(0);
			} else {
				pixel.setRed((avg * 2) - 255);
				pixel.setGreen(255);
				pixel.setBlue((avg * 2) - 255);
			}
		} else if (pixel.getY() > (imgrainbow.height / 4) * 3 && pixel.getY() <= imgrainbow.height) {
			if (avg < 128) {
				pixel.setRed(0);
				pixel.setGreen(0);
				pixel.setBlue(avg * 2);
			} else {
				pixel.setRed((avg * 2) - 255);
				pixel.setGreen((avg * 2) - 255);
				pixel.setBlue(255);
			}
		}


	}
}

function filterSine() {

	var amplitude = 40;
	var frequency = 20;

	for (var pixel of imgsine.values()) {
		if ((pixel.getY() > 0 &&
			pixel.getY() < imgsine.height / 4 + amplitude * Math.sin(pixel.getX() / frequency)) ||
		   	(pixel.getY() > 3*imgsine.height/4 + amplitude * Math.sin(pixel.getX()/frequency) &&
			pixel.getY() < imgsine.height)){

			pixel.setBlue(255);
			pixel.setGreen(255);
			pixel.setRed(255);
		}

	}

}
	

function imgSave() {
	
	var canvas = document.getElementById("imgcnv");
    var img    = canvas.toDataURL("image/png");	
    //document.write('<img src="'+img+'"/>');
	var ajax = new XMLHttpRequest();
	ajax.open("POST",'save.php',false);
	ajax.setRequestHeader('Content-Type', 'application/upload');
	ajax.send(img);

}



function filterBlur() {

	var ranNum;

	for (var pixel of imgblur.values()) {

		ranNum = Math.random();

		if (ranNum < 0.5) {

			var newpixel = getNearPixel(pixel);

			pixel.setRed(newpixel.getRed());
			pixel.setGreen(newpixel.getGreen());
			pixel.setBlue(newpixel.getBlue());


		}
	}
}


function getNearPixel(pixel) {

	var deltaX;
	var deltaY;
	var ranY = Math.random() * 20;
	var ranX = Math.random() * 20;
	var x;
	var y;

	if (ranY < 10) {
		deltaY = ranY;
	} else {
		deltaY = -ranY;
	}

	if (ranX < 10) {
		deltaX = ranX;
	} else {
		deltaX = -ranX;
	}

	if (pixel.getX() + deltaX < imgorigin.width && pixel.getX() + deltaX >= 0 &&
		pixel.getY() + deltaY < imgorigin.height && pixel.getY() + deltaY >= 0) {
		x = pixel.getX() + deltaX;
		y = pixel.getY() + deltaY;
	}
	if (pixel.getX() + deltaX < 0) {
		x = 0;
	}

	if (pixel.getY() + deltaY < 0) {
		y = 0;
	}
	if (pixel.getX() + deltaX >= imgorigin.width) {
		x = imgorigin.width - 1;
	}
	if (pixel.getY() + deltaY >= imgorigin.height) {
		y = imgorigin.height - 1;
	}

	return imgorigin.getPixel(x, y);


}
