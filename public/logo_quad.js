var vertexShaderObject_logo_quad;
var fragmentShaderObject_logo_quad;
var shaderProgramObject_logo_quad;

var vao_axis;
var vbo_axis_vertices;
var vao_circle1, vao_circle2;
var vbo_circle1_vertices, vbo_circle2_vertices;
var vao_quad1;
var vao_quad1_vertices;
var vao_quad2;
var vao_quad2_vertices;
var vao_quad3;
var vao_quad3_vertices;
var vao_quad4;
var vao_quad4_vertices;

var theta = 0.0;
var num_points = 400;
var pageAngle = 90.0;

var logoQuad_modelMatrixUniform;
var logoQuad_viewMatrixUniform;
var logoQuad_projectionMatrixUniform;

function logo_quad_init()
{

	//vertex shader
	vertexShaderObject_logo_quad =gl.createShader(gl.VERTEX_SHADER);

	var vertexShaderSourceCode_logo_quad = 
	"#version 300 es 										" +
	"													\n 	" +
	"in vec4 vPosition;										" +
	"uniform mat4 u_m_matrix;								" +
	"uniform mat4 u_v_matrix;								" +
	"uniform mat4 u_p_matrix;								" +
	"													\n 	" +
	"void main(void)										" +
	"{														" +
	"	gl_Position = u_p_matrix * u_v_matrix * u_m_matrix * vPosition;				" +
	"}														";

	gl.shaderSource(vertexShaderObject_logo_quad, vertexShaderSourceCode_logo_quad);
	gl.compileShader(vertexShaderObject_logo_quad);
	if(gl.getShaderParameter(vertexShaderObject_logo_quad, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(vertexShaderObject_logo_quad);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}

	//fragment shader
	fragmentShaderObject_logo_quad = gl.createShader(gl.FRAGMENT_SHADER);

	var fragmentShaderSourceCode_logo_quad = 
	"#version 300 es 										" +
	"													\n	" +
	"precision highp float;									" +
	"out vec4 FragColor;									" +
	"													\n	" +
	"void main(void)										" +
	"{														" +
	"	FragColor = vec4(1.0);								" +
	"}														" ;

	gl.shaderSource(fragmentShaderObject_logo_quad, fragmentShaderSourceCode_logo_quad);
	gl.compileShader(fragmentShaderObject_logo_quad);
	if(gl.getShaderParameter(fragmentShaderObject_logo_quad, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(fragmentShaderObject_logo_quad);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}

	//shader program object
	shaderProgramObject_logo_quad = gl.createProgram();
	gl.attachShader(shaderProgramObject_logo_quad, vertexShaderObject_logo_quad);
	gl.attachShader(shaderProgramObject_logo_quad, fragmentShaderObject_logo_quad);

	//pre linking binding to shader program object with shader attributes
	gl.bindAttribLocation(shaderProgramObject_logo_quad, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");

	// linking
	gl.linkProgram(shaderProgramObject_logo_quad);
	if(!gl.getProgramParameter(shaderProgramObject_logo_quad, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject_logo_quad);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}

	// get mvp uniform location
	logoQuad_modelMatrixUniform = gl.getUniformLocation(shaderProgramObject_logo_quad, "u_m_matrix");
	logoQuad_viewMatrixUniform = gl.getUniformLocation(shaderProgramObject_logo_quad, "u_v_matrix");
	logoQuad_projectionMatrixUniform = gl.getUniformLocation(shaderProgramObject_logo_quad, "u_p_matrix");

	// data
	var axisVertices = new Float32Array([
		1.8, 0.0, 0.0,	//right-bottom
		-1.8,0.0, 0.0
		]);

	vao_axis = gl.createVertexArray();
	gl.bindVertexArray(vao_axis);

	vbo_axis_vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_axis_vertices);
	gl.bufferData(gl.ARRAY_BUFFER, axisVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	// circle vertices
	var circle1 = new Float32Array(1200);
	var circle2 = new Float32Array(1200);
	//var circle3 = new Float32Array(300);

	for (var i = 0; i < num_points; i=i+3)
	{
		var angle = 2 * Math.PI * i/ num_points;
		
		circle1[i] = 1.8 * Math.cos(angle);
		circle1[i+1] = 1.8 * Math.sin(angle)+0;
		circle1[i+2] = 0.0;

		circle2[i] = 1.85 * Math.cos(angle);
		circle2[i+1] = 1.85 * Math.sin(angle)+0.0;
		circle2[i+2] = 0.0;
	}

	vao_circle1 = gl.createVertexArray();
	gl.bindVertexArray(vao_circle1);
	
	vbo_circle1_vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_circle1_vertices);
	gl.bufferData(gl.ARRAY_BUFFER, circle1, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	vao_circle2 = gl.createVertexArray();
	gl.bindVertexArray(vao_circle2);

	vbo_circle2_vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_circle2_vertices);
	gl.bufferData(gl.ARRAY_BUFFER, circle2, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindVertexArray(null);

	// quad data
	var quad1Vertices = new Float32Array([
		-0.75, 1.30, 0.0,	//1
		-0.85, 1.33, 0.0,	//2
		-0.85, 0.25, 0.0,	//3
		-0.85, 0.25, 0.0, //3
		-0.75, 0.28, 0.0, //4
		-0.75, 1.30, 0.0, //1
		-0.75, 0.28, 0.0, //4
		-0.85, 0.25, 0.0, //3
		-0.00, 0.08, 0.0, //5

		-0.75, 1.28, 0.0,	//1
		-0.85, 1.33, 0.0,	//2
		-0.00, 1.10, 0.0, //5
	]);


	vao_quad1 = gl.createVertexArray();
	gl.bindVertexArray(vao_quad1);
	
	vbo_quad1_vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_quad1_vertices);
	gl.bufferData(gl.ARRAY_BUFFER, quad1Vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	var quad2Vertices = new Float32Array([
		-0.9, 1.25, 0.0,	//1
		-1.0, 1.28, 0.0,	//2
		-1.0, 0.20, 0.0,	//3
		-1.0, 0.20, 0.0, //3
		-0.9, 0.23, 0.0, //4
		-0.9, 1.25, 0.0, //1
		-0.9, 0.23, 0.0, //4
		-1.0, 0.20, 0.0, //3
		-0.1, 0.08, 0.0 //5
	]);

	vao_quad2 = gl.createVertexArray();
	gl.bindVertexArray(vao_quad2);
	
	vbo_quad2_vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_quad2_vertices);
	gl.bufferData(gl.ARRAY_BUFFER, quad2Vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	var quad3Vertices = new Float32Array([
		-1.05, 1.20, 0.0,	//1
		-1.15, 1.23, 0.0,	//2
		-1.15, 0.13, 0.0,	//3
		-1.15, 0.13, 0.0, //3
		-1.05, 0.18, 0.0, //4
		-1.05, 1.20, 0.0, //1
		-1.05, 0.18, 0.0, //4
		-1.15, 0.13, 0.0, //3
		-0.25, 0.08, 0.0 //5
	]);

	vao_quad3 = gl.createVertexArray();
	gl.bindVertexArray(vao_quad3);
	
	vbo_quad3_vertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_quad3_vertices);
	gl.bufferData(gl.ARRAY_BUFFER, quad3Vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	const [minSize, maxSize] = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE);
	console.log("minSize :", minSize);
	console.log("maxSize :", maxSize);
	

}

function update_logo_quad()
{
	pageAngle = pageAngle-0.3;
	if(pageAngle <= 0.0)
	{
		pageAngle = 0.0;
		bShowAMC = true;
	}
}

function draw_logo_quad()
{
	//code
	var modelMatrix = mat4.create();
	var viewMatrix = mat4.create();
	var translationMatrix = mat4.create();
	var rotationMatrix = mat4.create();

	mat4.translate(translationMatrix, translationMatrix, [0.0,0.0,-4.0]);
	mat4.multiply(modelMatrix, modelMatrix, translationMatrix);
	
	gl.useProgram(shaderProgramObject_logo_quad);

	gl.uniformMatrix4fv(logoQuad_modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(logoQuad_viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(logoQuad_projectionMatrixUniform, false, perspectiveProjectionMatrix);
	
	// draw axis
	gl.bindVertexArray(vao_axis);
	gl.drawArrays(gl.LINES, 0, 2);
	gl.bindVertexArray(null);

	// draw circle1
	gl.bindVertexArray(vao_circle1);
	gl.drawArrays(gl.LINE_LOOP, 0, 400);
	gl.bindVertexArray(null);

	// draw circle2
	gl.bindVertexArray(vao_circle2);
	gl.drawArrays(gl.LINE_LOOP, 0, 400);
	gl.bindVertexArray(null);

	mat4.identity(modelMatrix);
	mat4.identity(translationMatrix);
	mat4.identity(rotationMatrix);

	mat4.translate(translationMatrix, translationMatrix, [0.0,0.0,-4.0]);
	mat4.multiply(modelMatrix, modelMatrix, translationMatrix);

	mat4.rotateY(rotationMatrix, rotationMatrix, (Math.PI * pageAngle)/180);
	mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

	gl.uniformMatrix4fv(logoQuad_modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(logoQuad_viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(logoQuad_projectionMatrixUniform, false, perspectiveProjectionMatrix);

	// draw quad1
	gl.bindVertexArray(vao_quad1);
	gl.drawArrays(gl.TRIANGLES, 0, 12);
	gl.bindVertexArray(null);
	
	// draw quad2
	gl.bindVertexArray(vao_quad2);
	gl.drawArrays(gl.TRIANGLES, 0, 9);
	gl.bindVertexArray(null);
	
	// draw quad3
	gl.bindVertexArray(vao_quad3);
	gl.drawArrays(gl.TRIANGLES, 0, 9);
	gl.bindVertexArray(null);

	mat4.identity(modelMatrix);
	mat4.identity(translationMatrix);
	mat4.identity(rotationMatrix);

	mat4.translate(translationMatrix, translationMatrix, [0.0,0.0,-4.0]);
	mat4.multiply(modelMatrix, modelMatrix, translationMatrix);

	mat4.rotateY(rotationMatrix, rotationMatrix, (Math.PI * 180)/180 - (Math.PI * pageAngle)/180);
	mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);
	

	gl.uniformMatrix4fv(logoQuad_modelMatrixUniform, false, modelMatrix);
	gl.uniformMatrix4fv(logoQuad_viewMatrixUniform, false, viewMatrix);
	gl.uniformMatrix4fv(logoQuad_projectionMatrixUniform, false, perspectiveProjectionMatrix);

	// draw quad1
	gl.bindVertexArray(vao_quad1);
	gl.drawArrays(gl.TRIANGLES, 0, 12);
	gl.bindVertexArray(null);
	
	// draw quad2
	gl.bindVertexArray(vao_quad2);
	gl.drawArrays(gl.TRIANGLES, 0, 9);
	gl.bindVertexArray(null);

	// draw quad3
	gl.bindVertexArray(vao_quad3);
	gl.drawArrays(gl.TRIANGLES, 0, 9);
	gl.bindVertexArray(null);

	gl.useProgram(null);

	update_logo_quad();
}

function logo_quad_uninitialize()
{
	//code
	if(vao_axis)
	{
		gl.deleteVertexArray(vao_axis);
		vao_axis = null;
	}

	if(vbo_axis_vertices)
	{
		gl.deleteBuffer(vbo_axis_vertices);
		vbo_axis_vertices = null;
	}

	if(shaderProgramObject_logo_quad)
	{
		if(fragmentShaderObject_logo_quad)
		{
			gl.detachShader(shaderProgramObject_logo_quad, fragmentShaderObject_logo_quad);
			gl.deleteShader(fragmentShaderObject_logo_quad);
			fragmentShaderObject_logo_quad = null;
		}

		if(vertexShaderObject_logo_quad)
		{
			gl.detachShader(shaderProgramObject_logo_quad, vertexShaderObject_logo_quad);
			gl.deleteShader(vertexShaderObject_logo_quad);
			vertexShaderObject_logo_quad = null;
		}
		gl.deleteProgram(shaderProgramObject_logo_quad);
		shaderProgramObject_logo_quad = null;

	}
}
