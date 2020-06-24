// shader objects
var parabola_vertexShaderObject;
var parabola_fragmentShaderObject;
var parabola_shaderProgramObject;

var parabola_vao;
var parabola_vbo_hop2;
var parabola_vbo_hop1;

var parabola_modelMatrix_uniform;
var parabola_viewMatrix_uniform;
var parabola_projectionMatrix_uniform;

var parabolaPath1 = new Float32Array(300);
var parabolaPath2 = new Float32Array(300);  // path 2  and 3 are same mathematically
var parabolaPath4 = new Float32Array(300);


function parabola_init()
{

    //vertexShader code
    var vertexShaderSourceCode = 
    "#version 300 es" +
    "\n" +
    "in vec4 vPosition;" +
    "uniform mat4 u_m_matrix;" +
    "uniform mat4 u_v_matrix;" +
    "uniform mat4 u_p_matrix;" +
    "void main(void)" +
    "{" +
        "gl_Position = u_p_matrix * u_v_matrix * u_m_matrix * vPosition;" +
    "}";

    parabola_vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(parabola_vertexShaderObject,vertexShaderSourceCode);
gl.compileShader(parabola_vertexShaderObject);

if(gl.getShaderParameter(parabola_vertexShaderObject,gl.COMPILE_STATUS)==false)
{
    var error = gl.getShaderInfoLog(parabola_vertexShaderObject);
    if(error.length > 0)
    {
        alert("VERTEXT SHADER EROOR");
        uninitialize();
    }
}

//fragment shader
var fragmentShaderSourceCode = 
"#version 300 es" +
"\n" +
"precision highp float;" +
"out  vec4 FragColor;" +
"void main(void)" +
"{" +
    "FragColor = vec4(1.0, 1.0, 1.0, 1.0);" +
"}";

parabola_fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(parabola_fragmentShaderObject,fragmentShaderSourceCode);
gl.compileShader(parabola_fragmentShaderObject);

if(gl.getShaderParameter(parabola_fragmentShaderObject,gl.COMPILE_STATUS)==false)
{
    var error = gl.getShaderInfoLog(parabola_fragmentShaderObject);
    if(error.length > 0)
    {
        alert("FRAGMENT SHADER ERROR");
        uninitialize();
    }
}
//shader program
parabola_shaderProgramObject = gl.createProgram();
gl.attachShader(parabola_shaderProgramObject, parabola_vertexShaderObject);
gl.attachShader(parabola_shaderProgramObject, parabola_fragmentShaderObject);

//prelinking
gl.bindAttribLocation(parabola_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");

//linking
gl.linkProgram(parabola_shaderProgramObject);
if(!gl.getProgramParameter(parabola_shaderProgramObject, gl.LINK_STATUS))
{
    var error = gl.getProgramInfoLog(parabola_shaderProgramObject);
    if(error.length > 0)
    {
            alert(error);
            uninitialize();
    }
}

//Post Link..getting uniforms locations
parabola_modelMatrix_uniform = gl.getUniformLocation(parabola_shaderProgramObject, "u_m_matrix");
parabola_viewMatrix_uniform = gl.getUniformLocation(parabola_shaderProgramObject, "u_v_matrix");
parabola_projectionMatrix_uniform = gl.getUniformLocation(parabola_shaderProgramObject, "u_p_matrix");

////////////******Vertices color texcoord, vao vbo*****///////////
//for hop1
var x = 0.0;
for(var i=0;i<150;i=i+3)
{
    parabolaPath1[i] = x;
    parabolaPath1[i+1] = -0.7 * x *x ;
    parabolaPath1[i+2] = 0.0;

    x += 0.03;
}
//for Hop2 hop3    
x = -1.2;
for(var i=0;i<300;i=i+3)
{
    parabolaPath2[i] = x;
    parabolaPath2[i+1] = -0.58 * x *x * 2;
    parabolaPath2[i+2] = 0.0;

    x += 0.024;
}
//for hop3
var x = -1.5;
for(var i=0;i<150;i=i+3)
{
    parabolaPath4[i] = x;
    parabolaPath4[i+1] = -0.7 * x *x ;
    parabolaPath4[i+2] = 0.0;

    x += 0.03;
}
    

    parabola_vao = gl.createVertexArray();
	gl.bindVertexArray(parabola_vao);

	parabola_vbo_hop2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, parabola_vbo_hop2);
	gl.bufferData(gl.ARRAY_BUFFER, parabolaPath1, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false , 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);

	//gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);
}

function parabola_draw()
{
    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var scaleMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [-4.7, 1.9 , -5.0]);
  //  mat4.scale(scaleMatrix, scaleMatrix, [1.0, 1.0, 1.0]);

    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
  //  mat4.multiply(modelMatrix, scaleMatrix, scaleMatrix);

    gl.useProgram(parabola_shaderProgramObject);

    //Hop1
    gl.uniformMatrix4fv(parabola_modelMatrix_uniform, false, modelMatrix);
	gl.uniformMatrix4fv(parabola_viewMatrix_uniform, false, viewMatrix);
	gl.uniformMatrix4fv(parabola_projectionMatrix_uniform, false, perspectiveProjectionMatrix);

    gl.bindVertexArray(parabola_vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,parabola_vbo_hop2);
    gl.bufferData(gl.ARRAY_BUFFER, parabolaPath1, gl.STATIC_DRAW);
	gl.drawArrays(gl.LINES, 0, 50);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    gl.bindVertexArray(null) ;
    
    // hop 2
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(scaleMatrix);

    mat4.translate(translateMatrix, translateMatrix, [0.37, 2.0, -5.0]);
    //  mat4.scale(scaleMatrix, scaleMatrix, [1.0, 1.0, 1.0]);

    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    //  mat4.multiply(modelMatrix, scaleMatrix, scaleMatrix);

    gl.uniformMatrix4fv(parabola_modelMatrix_uniform, false, modelMatrix);
	gl.uniformMatrix4fv(parabola_viewMatrix_uniform, false, viewMatrix);
	gl.uniformMatrix4fv(parabola_projectionMatrix_uniform, false, perspectiveProjectionMatrix);

    gl.bindVertexArray(parabola_vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,parabola_vbo_hop2);
    gl.bufferData(gl.ARRAY_BUFFER, parabolaPath2, gl.STATIC_DRAW);
	gl.drawArrays(gl.LINES, 0, 100);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null) ;

    // hop 3
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(scaleMatrix);

    mat4.translate(translateMatrix, translateMatrix, [-2.0, 2.0, -5.0]);
 //   mat4.scale(scaleMatrix, scaleMatrix, [1.0, 1.0, 1.0]);

    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
 //   mat4.multiply(modelMatrix, scaleMatrix, scaleMatrix);

	gl.uniformMatrix4fv(parabola_modelMatrix_uniform, false, modelMatrix);
	gl.uniformMatrix4fv(parabola_viewMatrix_uniform, false, viewMatrix);
	gl.uniformMatrix4fv(parabola_projectionMatrix_uniform, false, perspectiveProjectionMatrix);

    gl.bindVertexArray(parabola_vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,parabola_vbo_hop2);
    gl.bufferData(gl.ARRAY_BUFFER, parabolaPath2, gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, 100);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null) ;
    
    // hop 4
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(scaleMatrix);

    mat4.translate(translateMatrix, translateMatrix, [3.15, 1.95, -5.0]);
 //   mat4.scale(scaleMatrix, scaleMatrix, [1.0, 1.0, 1.0]);

    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
 //   mat4.multiply(modelMatrix, scaleMatrix, scaleMatrix);

	gl.uniformMatrix4fv(parabola_modelMatrix_uniform, false, modelMatrix);
	gl.uniformMatrix4fv(parabola_viewMatrix_uniform, false, viewMatrix);
	gl.uniformMatrix4fv(parabola_projectionMatrix_uniform, false, perspectiveProjectionMatrix);

    gl.bindVertexArray(parabola_vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,parabola_vbo_hop2);
    gl.bufferData(gl.ARRAY_BUFFER, parabolaPath4, gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, 50);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null) ;

	gl.useProgram(null);
}

function parabola_uninitialize()
{
	if(parabola_vao)
	{
		gl.deleteVertexArray(parabola_vao);
		parabola_vao = null;
	}

	if(parabola_vbo_hop2)
	{
		gl.deleteBuffer(parabola_vbo_hop2);
		parabola_vbo_hop2 = null;
	}

	if(parabola_shaderProgramObject)
	{
			if(parabola_fragmentShaderObject)
			{
				gl.detachShader(parabola_shaderProgramObject, parabola_fragmentShaderObject);
				gl.deleteShader(parabola_fragmentShaderObject);
				parabola_fragmentShaderObject = null;

			}

			if(parabola_vertexShaderObject)
			{
				gl.detachShader(parabola_shaderProgramObject, parabola_vertexShaderObject);
				gl.deleteShader(parabola_vertexShaderObject);
				parabola_vertexShaderObject = null;

			}
			gl.deleteProgram(parabola_shaderProgramObject);
			parabola_shaderProgramObject = null;
	}
}