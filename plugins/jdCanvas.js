const CircleProgress = function (canvas, options) {
    this._init(canvas, options);
}
CircleProgress.prototype = {
    ctx: null,
    step: 0,
    option: {},
    ctxWidth: '',
    ctxHeight: '',
    raf: '',
    _init: function (canvas, options) {
        this.ctx = canvas.getContext('2d');
        this.ctxWidth = canvas.width;
        this.ctxHeight = canvas.height;
        this.options = this._option(options);
        this.degree = this.options.scaleAngleArr[this.step];
        this.ctx.translate(this.ctxWidth / 2, this.ctxWidth / 2);
        this._draw()
    },
    // 角度转换弧度
    _rad: function (deg) {
        return Math.PI / 180 * deg;
    },
    _clear: function () {
        this.ctx.clearRect(-this.ctxWidth / 2, -this.ctxWidth / 2, this.ctxWidth, this.ctxHeight);
    },
    //绘制仪表盘底盘
    _surfase: function () {
        this.ctx.save();
        this.ctx.strokeStyle = this.options.arcBackColor;
        this.ctx.lineWidth = this.options.arcLineWidth;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.options.radius, -this.options.scaleRadArr[0], -this.options.scaleRadArr[this.options.steps - 1], true);
        this.ctx.stroke();
        //绘制文字完成度
        this.ctx.translate(0, -18);
        this.ctx.font = this.options.tipFont;
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = '#ffb9ac';
        this.ctx.fillText("完善度", 0, 0);
        this.ctx.restore();
    },
    //绘制动态圆弧
    _circle: function (arc) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.options.radius, this.options.scaleRadArr[0] - Math.PI, arc - Math.PI, false);
        this.ctx.stroke();
    },
    //绘制动态点
    _dot: function (dx, dy) {
        this.ctx.beginPath();
        this.ctx.arc(dx, dy, 3, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.fill();
    },
    // 绘制等级文字
    _gradeText: function (txt) {
        this.ctx.save();
        this.ctx.translate(0, -45);
        this.ctx.font = this.options.gradeFont;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(txt, 0, 0);
        this.ctx.restore();
    },
    // 绘制刻度文字
    _scaleText: function (step) {
        this.ctx.save();
        this.ctx.translate(-this.options.radius, 0);
        this.ctx.font = this.options.scaleFont;
        this.ctx.textAlign = 'center';
        var x;
        var y;
        var times;
        for (var i = 0; i < this.options.steps; i++) {
            if (step == i) {
                this.ctx.fillStyle = this.options.activeColor;
            } else {
                this.ctx.fillStyle = this.options.scaleColor;
            }
            times = ((((i + 1) - 3) % 3) > 0)? 1: (((((i + 1) - 3) % 3) < 0)? -1: 0);
            y = this.options.radius * Math.sin(this.options.scaleRadArr[i]) + 10;
            x = this.options.radius * (1 - Math.cos(this.options.scaleRadArr[i])) + 20 * times;
            this.ctx.fillText(this.options.scaleTxtArr[i], x, -y);
        }
        this.ctx.restore();
    },
    _draw: function () {
        this._clear();
        this._surfase();
        var arc = this._rad(this.degree);
        this.ctx.strokeStyle = this.options.activeColor;
        this.ctx.lineWidth = this.options.arcLineWidth;
        this._circle(arc);
        this.ctx.save();
        this.ctx.fillStyle = '#fff';
        var dx = -this.options.radius * Math.cos(arc);
        var dy = -this.options.radius * Math.sin(arc);
        this._dot(dx, dy);
        this.ctx.restore();
        this._gradeText(this.options.scaleTxtArr[this.step]);
        this._scaleText(this.step);
    },
    _speed: function () {
        this._draw();
        this.degree++;
        if (this.degree >= this.options.scaleAngleArr[this.step]) {
            window.cancelAnimationFrame(this.raf);
        } else {
            this.raf = window.requestAnimationFrame(this._speed.bind(this));
        }
    },
    _run: function () {
        this.step++;
        if (this.step > this.options.steps) return;
        this._speed();
    },
    _option: function (options) {
        var scaleAngleArr = [];
        var scaleRadArr = [];
        var scaleTxtArr = [];
        for (var i = 0; i < options.scales.length; i++) {
            scaleAngleArr.push(options.scales[i].degree);
            scaleRadArr.push(this._rad(options.scales[i].degree));
            scaleTxtArr.push(options.scales[i].text);
        }
        return {
            radius: options.radius || 200, //圆弧半径
            degStart: options.degStart || 0, //圆弧起始角度
            degEnd: options.degEnd || 180, //圆弧结束角度
            arcBackColor: options.arcBackColor || '#ddd',
            arcLineWidth: options.arcLineWidth || 2,
            scaleColor: options.scaleColor || '#999',
            activeColor: options.activeColor || '#f66',
            scaleFont: options.scaleFont || '14px "microsoft yahei"',
            gradeFont: options.gradeFont || 'bold 40px "microsoft yahei"',
            tipFont: options.tipFont || "18px 'microsoft yahei'",
            scaleAngleArr: scaleAngleArr,
            scaleRadArr: scaleRadArr,
            scaleTxtArr: scaleTxtArr,
            steps: options.scales.length
        }
    }
}

export default CircleProgress;