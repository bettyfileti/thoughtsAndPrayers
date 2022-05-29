const Y_AXIS = 1;
const X_AXIS = 2;

class Headline {
    constructor(eyebrow, text, style, numOfLines, subtext) {
        this.eyebrowText = eyebrow,
            this.headlineText = text,
            this.style = style,
            this.active = false,
            this.numOfLines = numOfLines,
            this.subtext = subtext
    }

    draw() {
        let eyebrowSize = 24;
        let headlineSize = 28;
        let headlineLeading = 28;

        let margin = 10;
        let lowerThird = height / 5;
        let eyebrowBG = {
            x: margin,
            y: height - lowerThird - (margin * 2.5),
            width: (eyebrowSize / 1.5) * this.eyebrowText.length,
            height: 32
        }

        let headlineBG = {
            x: margin,
            y: eyebrowBG.y + eyebrowBG.height,
            width: width - (margin * 2),
            height: 70
        }
        noStroke()

        if (this.style === "msnbc") {
            //grey background
            push();
            fill("lightgrey");
            stroke("lightgrey");
            strokeWeight(2);
            rect(0, height - lowerThird, width, lowerThird);

            //eyebrow
            noStroke();
            fill("white");
            rect(eyebrowBG.x, eyebrowBG.y, eyebrowBG.width, eyebrowBG.height);
            fill("#831811")
            textSize(eyebrowSize);
            textFont(futura);
            text(this.eyebrowText, eyebrowBG.x + margin, eyebrowBG.y + eyebrowSize - 2);

            //headline
            rect(headlineBG.x, headlineBG.y, headlineBG.width, headlineBG.height);

            fill("white");
            textFont(futuraCondensed);
            textSize(headlineSize);
            textAlign(CENTER);
            textLeading(headlineLeading);
            if (this.numOfLines === 1) {
                text(this.headlineText, headlineBG.x + margin, headlineBG.y + (margin * 2), headlineBG.width - (margin * 2));
            } else {
                text(this.headlineText, headlineBG.x + margin, headlineBG.y + margin, headlineBG.width - (margin * 2));
            }
            pop();
        } else if (this.style === "cnn") {
            push();

            //eyebrow
            fill("#b02418");
            noStroke();
            eyebrowBG.x = 0;
            eyebrowBG.y = eyebrowBG.y + (margin * 2);
            eyebrowBG.width = eyebrowBG.width + 20;
            eyebrowBG.height = height - eyebrowBG.y;
            rect(eyebrowBG.x, eyebrowBG.y, eyebrowBG.width, eyebrowBG.height);

            fill("white");
            textFont("helvetica");
            textStyle(BOLD);
            textSize(eyebrowSize);
            text(this.eyebrowText, eyebrowBG.x + margin, eyebrowBG.y + eyebrowSize);


            //headline
            headlineBG.y = eyebrowBG.y + 30;
            headlineBG.x = headlineBG.x - (margin / 2);
            headlineBG.height = height - headlineBG.y - margin;
            rect(headlineBG.x, headlineBG.y, headlineBG.width, headlineBG.height);

            fill("black");
            textFont("nimbus-sans-condensed");
            textSize(headlineSize);
            if (this.numOfLines === 1) {
                scale(0.675, 1.2);
                text(this.headlineText, headlineBG.x + margin, headlineBG.y - (margin * 3.25));
            } else {
                textLeading(26);
                scale(0.675, 1.0);
                textSize(headlineSize - 2);
                text(this.headlineText, headlineBG.x + margin, headlineBG.y + (margin / 1.5), headlineBG.width * 1.5, headlineBG.height * 2);
            }
            pop();

        } else if (this.style = "abc") {
            push();

            //eyebrow
            fill("white");
            eyebrowBG.width = width - (margin * 2);
            rect(eyebrowBG.x, eyebrowBG.y, eyebrowBG.width, eyebrowBG.height, 2);
            fill("#242e75");
            textSize(eyebrowSize);
            textFont("futura-pt");
            text(this.eyebrowText, eyebrowBG.x + margin, eyebrowBG.y + eyebrowSize);

            //header
            //setGradient(50, 190, 540, 80, "#242e75", "#ffffff", X_AXIS);
            fill("#15329b");
            textFont("futura-pt-bold");
            textSize(21);
            rect(headlineBG.x, headlineBG.y, headlineBG.width, headlineBG.height, 2);
            fill("white");
            text(this.headlineText, headlineBG.x + margin, headlineBG.y + (margin * 1.5), headlineBG.width - (margin * 2));
            textFont("futura-pt");
            textSize(15);
            text(this.subtext, headlineBG.x + margin, headlineBG.y + margin + (eyebrowSize * 1.25), headlineBG.width - (margin * 2));
            pop();
        }

    }
}

//--------------------------------------------------------------
function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();
    c1 = color(c1);
    c2 = color(c2);
    if (axis === Y_AXIS) {
        // Top to bottom gradient
        for (let i = y; i <= y + h; i++) {
            let inter = map(i, y, y + h, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    } else if (axis === X_AXIS) {
        // Left to right gradient
        for (let i = x; i <= x + w; i++) {
            let inter = map(i, x, x + w, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }
}