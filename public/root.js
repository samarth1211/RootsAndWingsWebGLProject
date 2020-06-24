function rami_root(b1,b2, th1,th2,nfi, R0,R1,R2, l0,l1,l2, a, stu)
{
   var bc = new Float32Array(12), // cpc, bnc, bnc2, bn0top
       b0 = new Float32Array(b1),  
       ssu = (su_root-1)/stu + 1
   var co = Math.cos(th1),  si = Math.sin(th1), ta2 = Math.tan(th1*.5),
       fi = Math.PI*nfi/(ssu-1),  cof = Math.cos(fi), sif = Math.sin(fi)
   for(var i = 0; i < 3; i++)
   {
     b0[i+6] = sif*b1[i+3] + cof*b1[i+6] // fi rot
     b0[i+3] = b1[i+3] = b2[i+3] = cof*b1[i+3] - sif*b1[i+6]
     bc[i] = b1[i+9] + l0*b1[i]
     bc[i+3] = ta2*b0[i] + b0[i+6]
     b1[i+6] = si*b0[i] + co*b0[i+6]     // th rot
     b1[i]   = co*b0[i] - si*b0[i+6]
     b1[i+9] = bc[i] + l1*b1[i] 
    }
   b1[12] -= nfi/(ssu-1);   b2[12] =  b1[12];   b2[13] =  b1[13]
   var Rm = (R0*l0 + R1*l1)/(l0 + l1);
   patch_root(b1, R0,R1,Rm, 0,0, l0+l1);       // side 1
   var th = .5*(th1+th2), dth = .5*(th1-th2),
       si2 = Math.sin(dth*(1-a)), t = th + dth*a
   co = Math.cos(t);  si = Math.sin(t)
   for(var i = 0; i < 3; i++)
     bc[i+3] = (b0[i]*co - b0[i+6]*si)/si2     // -bnc1
   t = th - dth*a;  co = Math.cos(t); si = Math.sin(t)
   var Rm2 = (R0*l0 + R2*l2)/(l0 + l2)
   for(var i = 0; i < 3; i++){
     bc[i+6] = (b0[i]*co - b0[i+6]*si)/(-si2)  // bnc2
     bc[i+9] = -b0[i]*l0 - (-bc[i+3]*Rm + bc[i+6]*Rm2)*.5 }
   patch_root(b1, R0,R1,Rm, su_root-1,1, l0+l1)          // top 1
   co = Math.cos(th2);  si = Math.sin(th2);  ta2 = Math.tan(th2*.5)
   for(var i = 0; i < 3; i++){
     bc[i+3] = ta2*b0[i] + b0[i+6]
     b2[i+6] = si*b0[i] + co*b0[i+6]   // th rot
     b2[i]   = co*b0[i] - si*b0[i+6]
     b2[i+9] = bc[i] + l2*b2[i] }
   patch_root(b2, R0,R2,Rm2, su_root-1,0, l0+l2) // side 2
   for(var i = 0; i < 3; i++){
     bc[i+3] = bc[i+6]
     bc[i+9] = -bc[i+9] }
   patch_root(b2, R0,R2,Rm2, 0,1, l0+l2)    // top 2
   b1[13] += .5*(l0+l1)
   b2[13] += .5*(l0+l2)

 function patch_root(b, R0,R1,Rm, u0,top, ls){
   ls *= .5
   var t = off_root/8, tm = t + ssu,  to,bo, si,co, c0,c1;

   for(var j = 0; j < sv_root-1; j++ )
   {
     for(var i = 0; i < su_root-1; i += stu )
     {
       ind_root[pi_root++] = t++;  
       ind_root[pi_root++] = t;  
       ind_root[pi_root++] = tm;
       ind_root[pi_root++] = tm++; 
       ind_root[pi_root++] = t;  
       ind_root[pi_root++] = tm;
      }
     t++;  tm++;
    }
   if(top){ c0 = (u0)? -b0[0] : b0[0];  c1 = (c0 + b[6])*.5 }
   else{ c0 = b0[6]; c1 = bc[3] }
   for(var v = 0; v < sv_root; v++ )
   {
    var t = v/(sv_root-1),  t1 = 1-t,  B0 = t1*t1,  B1 = 2*t*t1, B2 = t*t;
    for(var u = 0; u < su_root; u += stu )
    {
      si = sin[u+u0]; co = cos[u+u0]
      for(var i = 0; i < 3; i++)
      {
        bo = b[i+3]*co;
        to = (top) ? bc[i+9]*si : b0[i+6]*si*R0
        pt_root[off_root++] = (b0[i+9] + to + bo*R0)*B0 +
          (bc[i] + (bc[i+3]*si + bo)*Rm)*B1 +
          (b[i+9] + (b[i+6]*si + bo)*R1)*B2
      }
      var li = .5*(b[3]*co + (B0*c0 + B1*c1 + B2*b[6])*si)
      if(li < 0) li = 0;
      pt_root[off_root++] = .6 + li; 
      pt_root[off_root++] = .3 + li; 
      pt_root[off_root++] = 0;
      pt_root[off_root++] = ls*t + b[13];  
      pt_root[off_root++] = u/(su_root-1) + b[12]
    }
   }
 } // end patch_root
}
function base(b, nfi, R0,R2,dR, l0,l1, redu){
   var t = off/8,  tm = t + sv
   for(var u = 0; u < 2*su-2; u++ )
   {
     for(var j = 0; j < sv-1; j++ )
     {
       ind_root[pi_root++] = t++;  
       ind_root[pi_root++] = tm;  
       ind_root[pi_root++] = t
       ind_root[pi_root++] = tm++; 
       ind_root[pi_root++] = tm;  
       ind_root[pi_root++] = t;
      }
     t++;  tm++;
    }
   var fi = Math.PI*nfi/(su-1),  cof = Math.cos(fi), sif = Math.sin(fi)
   var cp = new Float32Array(6)
   for(var i = 0; i < 3; i++){
     cp[i] = b[i+9];   cp[i+3] = b[i+9] + l0*b[i]
     t = sif*b[i+3] + cof*b[i+6] // fi rot
     b[i+3] = cof*b[i+3] - sif*b[i+6]
     b[i+6] = t
     b[i+9] = cp[i+3] + l1*b[i]
   }
   b[12] -= nfi/(su-1)
   var du = 14*Math.PI/(2*su_root-2)
   for(var u = 0; u < 2*su_root-1; u++ ){
    var si = sin[u], co = cos[u], si2 = si, co2 = co
    if(redu && (u & 1)){
      si2 = (sin[u - 1] + sin[u + 1])*.5
      co2 = (cos[u - 1] + cos[u + 1])*.5 }
    var Ru = R0 + dR*Math.sin(du*u)
    for(var v = 0; v < sv_root; v++ ){
      var t = v/(sv_root-1),  t1 = 1-t,  B0 = t1*t1,  B1 = 2*t*t1, B2 = t*t;
      for(var i = 0; i < 3; i++){
        pt[off_root++] = (cp[i] + (b[i+6]*si + b[i+3]*co)*Ru)*B0 +
          (cp[i+3] + (b[i+6]*si + b[i+3]*co)*R2)*B1 +
          (b[i+9] + (b[i+6]*si2 + b[i+3]*co2)*R2)*B2
      }
      var li = .5*(b[3]*co + b[6]*si)
      if(li < 0) li = 0
      pt_root[off_root++] = .6 + li; 
      pt_root[off_root++] = .3 + li; 
      pt_root[off_root++] = 0;
      pt_root[off_root++] = t + b[13];  
      pt_root[off_root++] = u/(su_root-1) + b[12]
    }
   }
   b[13]++
}

function twig_root(b, th,nfi, R0,R2, l0,l1, stu,sub)
{
   var t = off_root/8, ssu = (su_root-1)/stu + 1,  tm = t + 2*ssu - 1
   for(var j = 0; j < sv_root-1; j++ )
   {
     for(var u = 0; u < 2*ssu-2; u++ )
     {
       ind_root[pi_root++] = t++;  
       ind_root[pi_root++] = t;  
       ind_root[pi_root++] = tm;
       ind_root[pi_root++] = tm++; 
       ind_root[pi_root++] = t;  
       ind_root[pi_root++] = tm;
      }
     t++;  tm++;}
   var co = Math.cos(th),  si = Math.sin(th), ta2 = Math.tan(th*.5),
       fi = Math.PI*nfi/(ssu-1),  cof = Math.cos(fi), sif = Math.sin(fi)
   var cp = new Float32Array(6), bn = new Float32Array(6)
   for(var i = 0; i < 3; i++)
   {
     cp[i] = b[i+9];   cp[i+3] = b[i+9] + l0*b[i]
     bn[i]  = sif*b[i+3] + cof*b[i+6] // fi rot
     b[i+3] = cof*b[i+3] - sif*b[i+6]
     bn[i+3] = ta2*b[i] + bn[i]
     b[i+6] = si*b[i] + co*bn[i]     // th rot
     b[i]   = co*b[i] - si*bn[i]
     b[i+9] = cp[i+3] + l1*b[i]
   }
   b[12] -= nfi/(ssu-1)
   var ls = .5*(l0+l1),  R1 = (l0*R0 + l1*R2)/(l0+l1)
   for(var v = 0; v < sv_root; v++ )
   {
    var t = v/(sv_root-1),  t1 = 1-t,  B0 = t1*t1,  B1 = 2*t*t1, B2 = t*t;
    for(var u = 0,u1=0;u < 2*su_root-1; u+=stu, u1++)
    {
      var si = sin[u], co = cos[u], si2 = si, co2 = co
      if(sub && (u1 & 1))
      {
        si2 = (sin[u - stu] + sin[u + stu])*.5
        co2 = (cos[u - stu] + cos[u + stu])*.5 
      }
      for(var i = 0; i < 3; i++)
      {
        pt_root[off_root++] = (cp[i] + (bn[i]*si + b[i+3]*co)*R0)*B0 +
          (cp[i+3] + (bn[i+3]*si + b[i+3]*co)*R1)*B1 +
          (b[i+9] + (b[i+6]*si2 + b[i+3]*co2)*R2)*B2
      }
      var li = .5*(b[3]*co + (B0*bn[0] + B1*bn[3] + B2*b[6])*si)
      if(li < 0) li = 0
//      pt[off++] = .7 - .3*(u1 & 1); pt[off++] = .6 - .3*(u1 & 1); pt[off++] = 0;
      pt_root[off_root++] = .6 + li; 
      pt_root[off_root++] = .3 + li; 
      pt_root[off_root++] = 0;
      pt_root[off_root++] = ls*t + b[13];  
      pt_root[off_root++] = u/(su_root-1) + b[12]
    }
   }
   b[13] += ls
}

