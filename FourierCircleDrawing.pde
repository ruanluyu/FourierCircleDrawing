float datas[][] = null;
float rp[][] = null;
int maxCircle = -1;//Max num off circle,unlimited when it is -1
float rotationSpeed = 0.0003f;//Speed of rotation

void setup() {

  String[] lines = loadStrings("FourierMath/datas.txt");
  datas = new float[lines.length][2];
  rp = new float[lines.length][2];
  for (int i = 0; i < lines.length; i++) {
    String cache[] = split(lines[i], ",");
    if (cache.length<2) {
      break;
    }
    datas[i][0] = Float.parseFloat(cache[0].replace("[",""));
    datas[i][1] = Float.parseFloat(cache[1].replace("]",""));
    rp[i][0] = sqrt(datas[i][0]*datas[i][0]+datas[i][1]*datas[i][1]);
    rp[i][1] = atan2(datas[i][1],datas[i][0]);
  }
  size(1920, 1080);
  spot = createGraphics(width, height);
  coord = createGraphics(width, height);
  coord.beginDraw();
  coord.stroke(0,15,25,100);
  coord.line(0, coord.height/2f, coord.width, coord.height/2f);
  coord.line(coord.width/2f, 0, coord.width/2f, coord.height);
  coord.endDraw();
}
PVector size = new PVector(1, 1); // pixel/unit
PGraphics spot = null;
PGraphics coord = null;
PVector lastPos = new PVector();
float t = -0f;//init t.If you want program to start drawing at beginning,set this to 0.
float at = 0f;
float atv = 0.1f;
float atf = 100f;
float atT = 0.5f;
int reversey = 1;

void draw() {
  background(255);
  t+=rotationSpeed;
  at+=atv;
  image(coord, 0, 0);
  PVector center = new PVector();
  PVector pointer = new PVector();
  noFill();
  stroke(255);
  int num = (maxCircle>0)?min(maxCircle,datas.length):datas.length;
  for (int i = 0; i<num; i++) {
    int m = 0;
    float aph = map(sin(((1-(float)i/num)*atf+at)/atT),-1,1,50,255);
    
    if (i>0) m = ((i+1)/2)*((i%2 == 0)?-1:1);
    float r = rp[i][0];
    stroke(175);
    ellipse(center.x*size.x+width/2f, reversey*center.y*size.y+height/2f, r*size.x*2f, r*size.y*2f);
    float theta = reversey*t*m+rp[i][1];
    pointer.add(new PVector(r*cos(theta), r*sin(theta)));
    if (m == 0) pointer.set(datas[0][0], datas[0][1]);
    stroke(100,(aph<240?255:0));
    line(center.x*size.x+width/2f, reversey*center.y*size.y+height/2f, pointer.x*size.x+width/2f, reversey*pointer.y*size.y+height/2f);
    center.set(pointer);
  }
  stroke(10, 255, 10);
  fill(100, 124, 255, 150);
  ellipse(pointer.x*size.x+width/2f, reversey*pointer.y*size.y+height/2f, 8, 8);
  if(t>=0){
    spot.beginDraw();
    spot.noStroke();
    //spot.stroke(0, 155, 255);
    //spot.strokeWeight(3);
    spot.fill(0, 155, 255);
    spot.translate(spot.width/2f, spot.height/2f);
    //spot.line(lastPos.x*size.x,lastPos.y*size.y,pointer.x*size.x,pointer.y*size.y);
    spot.ellipse(pointer.x*size.x, reversey*pointer.y*size.y, 5, 5);
    spot.endDraw();
    image(spot, 0, 0);
  }
  lastPos.set(pointer);
  //noLoop();
}
