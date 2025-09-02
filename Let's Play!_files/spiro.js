class SpiroWheel {
  constructor(rc, rm, rd, angle, clr, r, g, b, a, thickness) {
    this.rc = rc;
    this.rm = (rm % 2 == 0) ? rm : rm - 1;
    this.rd = rd;
    this.angle = angle;
    this.prev = null;
    this.looped = false;
    this.r = r || floor(random(0, 255));
    this.g = g || floor(random(0, 255));
    this.b = b || floor(random(0, 255));
    this.a = a || 255;
    this.thickness = thickness || 1;
    this.color = clr ? clr : floor(random(0, 360));
    this.sx = null;
    this.sy = null;
    this.cnt = 0;
  }

  calcCoords() {
    let mx = (this.rc - this.rm) * cos(this.angle);
    let my = (this.rc - this.rm) * sin(this.angle);

    this.x = this.rd * cos((this.rc - this.rm) / this.rm * -this.angle) + mx;
    this.y = this.rd * sin((this.rc - this.rm) / this.rm * -this.angle) + my;

    if (this.sx == null) {
      this.sx = this.x;
      this.sy = this.y;
    }
  }

  move(dAngle) {
    if (this.looped) return;
    this.prev = { x: this.x, y: this.y };
    this.angle += dAngle;
    this.calcCoords();
    this.checkLooped();
    this.cnt++;
  }

  updateColor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  updateThickness(thickness) {
    this.thickness = thickness;
  }

  updateParams(rc, rm, rd) {
    this.rc = rc;
    this.rm = (rm % 2 == 0) ? rm : rm - 1;
    this.rd = rd;
    this.calcCoords(); // Recalculate coordinates with new parameters
  }

  show() {
    colorMode(RGB);
    stroke(this.r, this.g, this.b, this.a);
    strokeWeight(this.thickness);
    noFill();
    if (this.prev) {
      beginShape();
      vertex(this.prev.x, this.prev.y);
      vertex(this.x, this.y);
      endShape();

      grph.push();
      grph.translate(width / 2, height / 2);
      grph.colorMode(RGB);
      grph.stroke(this.r, this.g, this.b, this.a);
      grph.strokeWeight(this.thickness);
      grph.noFill();
      grph.beginShape();
      grph.vertex(this.prev.x, this.prev.y);
      grph.vertex(this.x, this.y);
      grph.endShape();
      grph.pop();
    }
  }

  checkLooped() {
    if (this.cnt > 5 && abs(this.sx - this.x) < 1 && abs(this.sy - this.y) < 1) {
      this.looped = true;
    }
  }
}