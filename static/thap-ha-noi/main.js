// Class Dia
function Dia(aWidth, aHeight, aColor)
{
	this.mWidth = aWidth;
	this.mHeight = aHeight;
	this.mColor = aColor;
	this.mDOMElement = document.createElement("div");
	this.mDOMElement.style.position = "absolute";
	this.mDOMElement.style.width = aWidth + "px";
	this.mDOMElement.style.height = aHeight + "px";
	this.mDOMElement.style.backgroundColor = aColor;
}

Dia.prototype.setPosition = function(x, y)
{
	this.mDOMElement.style.left = x + "px";
	this.mDOMElement.style.top = y + "px";
}

// Class Coc
function Coc(aGame, aPosX, aPosY, aWidth, aLength, aBetweenDia, aTotalHeight)
{
	this.mPosX = aPosX;
	this.mPosY = aPosY;
	this.mWidth = aWidth;
	this.mArrayDia = [];
	this.mLength = aLength;
	this.mBetweenDia = aBetweenDia;
	this.mTotalHeight = aTotalHeight;
	this.mGame = aGame;
	
	this.mWCoc = 15;
	
	this.mDOMElement = document.createElement("div");
	this.mDOMElement.style.left = aPosX + "px";
	this.mDOMElement.style.top = aPosY + "px";
	this.mDOMElement.style.width = aWidth + "px";
	this.mDOMElement.style.height = aTotalHeight + "px";
	this.mDOMElement.style.position = "absolute";
	
	this.drawCoc();
}

Coc.prototype.doSelect = function()
{
	var lastW = this.mArrayDia[this.mLength - 1].mWidth;
	this.mArrayDia[this.mLength - 1].setPosition(this.mPosX + (this.mWidth - lastW) / 2, this.mPosY);
}

Coc.prototype.doRemove = function()
{
	if (this.mLength == 0) return null;
	this.mLength--;
	return this.mArrayDia[this.mLength];
}

Coc.prototype.doAdd = function(aDia)
{
	this.mArrayDia[this.mLength] = aDia;
	this.mLength++;
	
	this.doNormal();
}

Coc.prototype.doNormal = function()
{
	var trueHeight = 0;
	for (var i = 0; i < this.mLength; i++)
	{
		trueHeight += this.mArrayDia[i].mHeight + this.mBetweenDia;
	}
	var dia = this.mArrayDia[this.mLength - 1];
	dia.setPosition(this.mPosX + (this.mWidth - dia.mWidth) / 2, this.mPosY + this.mTotalHeight - trueHeight);
}

Coc.prototype.getLastWidth = function()
{
	if (this.mLength == 0) return 1000;
	return this.mArrayDia[this.mLength - 1].mWidth;
}

Coc.prototype.drawCoc = function()
{
	var d1 = document.createElement("div");
	d1.style.position = "absolute";
	d1.style.left = (this.mPosX + (this.mWidth - this.mWCoc) / 2) + "px";
	d1.style.top = this.mPosY + "px";
	d1.style.width = this.mWCoc + "px";
	d1.style.height = this.mTotalHeight + "px";
	d1.style.backgroundColor = "black";
	this.mGame.mDOMElement.appendChild(d1);
	
	var d2 = document.createElement("div");
	d2.style.position = "absolute";
	d2.style.left = this.mPosX + "px";
	d2.style.top = this.mPosY + this.mTotalHeight + "px";
	d2.style.width = this.mWidth + "px";
	d2.style.height = this.mWCoc + "px";
	d2.style.backgroundColor = "black";
	this.mGame.mDOMElement.appendChild(d2);
}

// Class Game
function Game(aPosX, aPosY, aNumberDia, aDiaColor, aMaxWidthDia, aDiaHeight, aDiaBetween, aCocBetween)
{
	this.mPosX = aPosX;
	this.mPosY = aPosY;
	this.mNumberDia = aNumberDia;
	this.mDiaColor = aDiaColor;
	this.mMaxWidthDia = aMaxWidthDia;
	this.mDiaHeight = aDiaHeight;
	this.mDiaBetween = aDiaBetween;
	this.mCocBetween = aCocBetween;
	
	this.mCocSelected = null;
	
	this.mCurPath = 0;
	
	this.mArrayDia = [];
	for (var i = 1; i <= this.mNumberDia; i++)
	{
		this.mArrayDia[i - 1] = new Dia(
			this.mMaxWidthDia * i / this.mNumberDia,
			this.mDiaHeight, this.mDiaColor);
	}

	this.mDOMElement = document.createElement("div");
	this.mDOMElement.id = "Game";
	
	var totalHeight = (this.mDiaHeight + this.mDiaBetween) * (this.mNumberDia + 3);
	this.mCoc1 = new Coc(this, aPosX, aPosY, this.mMaxWidthDia, 0, this.mDiaBetween,
						 totalHeight);
	this.mCoc2 = new Coc(this, aPosX + this.mMaxWidthDia + this.mCocBetween, aPosY, this.mMaxWidthDia, 0, this.mDiaBetween,
						totalHeight);
	this.mCoc3 = new Coc(this, aPosX + (this.mMaxWidthDia + this.mCocBetween) * 2, aPosY, this.mMaxWidthDia, 0, this.mDiaBetween,
						totalHeight);
	
	for (var i = this.mNumberDia - 1; i >= 0; i--)
	{
		this.mCoc1.doAdd(this.mArrayDia[i]);
	}
	
	this.mDOMElement.appendChild(this.mCoc1.mDOMElement);
	this.mDOMElement.appendChild(this.mCoc2.mDOMElement);
	this.mDOMElement.appendChild(this.mCoc3.mDOMElement);
	this.mDOMElement.dad = this;
	
	for (var i = 0; i < this.mNumberDia; i++)
	{
		this.mDOMElement.appendChild(this.mArrayDia[i].mDOMElement);
	}
	
	this.mDOMElement.onclick = function(evt)
	{
		if (!evt) evt = window.event;
		var x = evt.clientX - this.dad.mPosX;
		var id = Math.floor( x / (this.dad.mMaxWidthDia + this.dad.mCocBetween) );
		this.dad.onclick(id);
	}
}

Game.prototype.onclick = function(cocId)
{
	var coc;
	if (cocId == 0) coc = this.mCoc1;
	else if (cocId == 1) coc = this.mCoc2;
	else coc = this.mCoc3;
	
	if (this.mCocSelected == null)
	{
		if (coc.mLength == 0) return;
		this.mCocSelected = coc;
		coc.doSelect();
	}
	else if (this.mCocSelected == coc)
	{
		this.mCocSelected = null;
		coc.doNormal();
	}
	else
	{
		if (this.mCocSelected.getLastWidth() > coc.getLastWidth()) return;
		coc.doAdd(this.mCocSelected.doRemove());
		this.mCurPath++;
		document.getElementById("CurPath").firstChild.data = this.mCurPath;
		this.mCocSelected = null;
		if (this.mCoc3.mLength == this.mNumberDia)
		{
			alert("FINISH!");
			replay();
		}
	}
}








