var vertexShaderObject_font;
var fragmentShaderObject_font;
var shaderProgramObject_font;

var vertexArrayObject_Square;
var vertexBufferObject_Square_Position;
var vertexBufferObject_Square_Texture;

var uniform_ModelMatrix;
var uniform_ViewMatrix;
var uniform_ProjectionMatrix;
var uniform_fontAlphaValue;
var uniform_fontopColor;
var uniform_texture0_sampler_logo_font;

var textureA = 0;
var textureM = 0;
var textureC = 0;

// font  context variable
var textCtx ;

function degToRad_font(d) 
{
	return (d * Math.PI) / 180.0;
}

function samInit_font()
{
	textCtx = document.createElement("canvas").getContext("2d");

	// vertex shader
	var vertexShaderSourceCode_font = 
	"	#version 300 es																			"+
	"																						\n	"+
	"	in vec4 vPosition;																		"+
	"	in vec2 vTexture0_Coord;																"+
	"																						\n	"+
	"	out vec2 out_texture0_coord;															"+
	"																						\n	"+
	"	uniform mat4 u_model_matrix;															"+
	"	uniform mat4 u_view_matrix;																"+
	"	uniform mat4 u_projection_matrix;														"+
	"																						\n	"+
	"	void main (void)																		"+
	"	{																						"+
			"gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;	"+
			"out_texture0_coord = vTexture0_Coord;												"+
	"	}																						";
	
	var vertexShaderObject_font = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_font,vertexShaderSourceCode_font);
	gl.compileShader(vertexShaderObject_font);
	if (gl.getShaderParameter(vertexShaderObject_font,gl.COMPILE_STATUS)==false) 
	{
		var error = gl.getShaderInfoLog(vertexShaderObject_font);
		if (error.length > 0) 
		{
			alert(error);
			samUninitialize_font();
		}
	}

	// fragment shader
	var fragmentShaderSourceCode_font = 
	"	#version 300 es																				"+
	"																							\n	"+
	"	precision highp float;																		"+
	"	in vec2 out_texture0_coord;																	"+
	"																							\n	"+
	"	out vec4 FragColor;																			"+
	"																							\n	"+
	"	uniform highp sampler2D u_texture0_sampler;													"+
	"	uniform float u_fontAlphaValue;															\n	"+
	"	uniform vec3 u_opColor;																						\n	"+
	"	void main (void)																			"+
	"	{																							"+
			"vec4 temp_color = texture(u_texture0_sampler,out_texture0_coord);						"+
			"if(temp_color.r == 0.0 )																"+
			"{																						"+
				"discard;																			"+
			"}																						"+
			"else																					"+
			"{																						"+
				"FragColor = vec4(u_opColor.r,u_opColor.g,u_opColor.b,u_fontAlphaValue);			"+
			"}																						"+
	"	}																							";
	
	var fragmentShaderObject_font = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_font,fragmentShaderSourceCode_font);
	gl.compileShader(fragmentShaderObject_font);

	if (!gl.getShaderParameter(fragmentShaderObject_font,gl.COMPILE_STATUS)) 
	{
		var error = gl.getShaderInfoLog(fragmentShaderObject_font);
		if (error.length > 0) 
		{
			alert(error);
			samUninitialize_font();
		}
	}

	// shader program
	shaderProgramObject_font = gl.createProgram();
	gl.attachShader(shaderProgramObject_font,vertexShaderObject_font);
	gl.attachShader(shaderProgramObject_font,fragmentShaderObject_font);

	// pre-link building of shader 
	gl.bindAttribLocation(shaderProgramObject_font, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(shaderProgramObject_font, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,"vTexture0_Coord");

	//link
	gl.linkProgram(shaderProgramObject_font);
	if (!gl.getProgramParameter(shaderProgramObject_font,gl.LINK_STATUS)) 
	{
		var error = gl.getProgramParameter(shaderProgramObject_font,gl.LINK_STATUS);
		if (error.length > 0) 
		{
			alert(error);
			samUninitialize_font();
		}
	}

	// mvp location  
	uniform_ModelMatrix = gl.getUniformLocation(shaderProgramObject_font,"u_model_matrix");
	uniform_ViewMatrix = gl.getUniformLocation(shaderProgramObject_font,"u_view_matrix");
	uniform_ProjectionMatrix = gl.getUniformLocation(shaderProgramObject_font,"u_projection_matrix");
	uniform_texture0_sampler_logo_font = gl.getUniformLocation(shaderProgramObject_font,"u_texture0_sampler");
	uniform_fontAlphaValue = gl.getUniformLocation(shaderProgramObject_font, "u_fontAlphaValue");
	uniform_fontopColor = gl.getUniformLocation(shaderProgramObject_font, "u_opColor");

	// Vertices, colors, shader, vbo and vao initalization	
	var quadVertices= new Float32Array([
		 1.0, 0.5, 0.0,
		-1.0, 0.5, 0.0,
		-1.0, -0.5, 0.0,
		 1.0, -0.5, 0.0
	]);

	var quadTexcoord = new Float32Array([
		1.0, 0.0,
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0
	]);

	vertexArrayObject_Square = gl.createVertexArray();
	gl.bindVertexArray(vertexArrayObject_Square);
	
	vertexBufferObject_Square_Position = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject_Square_Position);
	gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	vertexBufferObject_Square_Texture=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject_Square_Texture);
	gl.bufferData(gl.ARRAY_BUFFER,quadTexcoord,gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	/*Create Text Texture Start */
	
	var textCanvas_A = makeTextCanvas_font("A", 500, 250);
	textureA = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,textureA);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textCanvas_A);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	//gl.bindTexture(gl.TEXTURE_2D,null);

	var textCanvas_M = makeTextCanvas_font("M",500, 250);
	textureM = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,textureM);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textCanvas_M);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	//gl.bindTexture(gl.TEXTURE_2D,null);

	
	var textCanvas_C = makeTextCanvas_font("C", 500, 250);
	textureC = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,textureC);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textCanvas_C);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	//gl.bindTexture(gl.TEXTURE_2D,null);

}

function samUpdate_font()
{

}

function makeTextCanvas_font(text,width,height)
{
	textCtx.canvas.width = width;
	textCtx.canvas.height = height;
	textCtx.font ="110px Verdana";
	textCtx.textAlign = "center";
	textCtx.textBaseline = "middle";
	textCtx.fillStyle = "red";
	textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
	textCtx.fillText(text, width / 2, height / 2);
	return textCtx.canvas;
}

function samDraw_font()
{
	var modelMatrix=mat4.create();
	var viewMatrix=mat4.create();
	var translateMatrix = mat4.create();

	// ******************** Letter A *************************
	gl.useProgram(shaderProgramObject_font);

	mat4.translate(translateMatrix, translateMatrix,[-0.4,0.6,-3.5]);
	mat4.multiply(modelMatrix,translateMatrix,modelMatrix);

	// send uniforms
	gl.uniformMatrix4fv(uniform_ModelMatrix,false,modelMatrix);						// model Matrix
	gl.uniformMatrix4fv(uniform_ViewMatrix,false,viewMatrix);						// view Matrix
	gl.uniformMatrix4fv(uniform_ProjectionMatrix,false,perspectiveProjectionMatrix);// projection Matrix
	// if showAMC is true send alpha value 1.0, else 0.0
	if(bShowAMC == true)
	{
		gl.uniform1f(uniform_fontAlphaValue, 1.0);									// alpha value 1.0
	}
	else if(bShowAMC == false)
	{
		gl.uniform1f(uniform_fontAlphaValue, 0.0);									// alphaValue 0.0
	}
	gl.uniform3f(uniform_fontopColor,1.0,0.0,0.0);									// font Color

	// bind to texture C
	gl.bindTexture(gl.TEXTURE_2D,textureA);
	gl.uniform1i(uniform_texture0_sampler_logo_font,0);										// sampler 0

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.bindVertexArray(vertexArrayObject_Square);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	gl.disable(gl.BLEND);
	
	gl.useProgram(null);

	// ********************* Letter M *********************
	gl.useProgram(shaderProgramObject_font);

	mat4.identity(translateMatrix);
	mat4.identity(modelMatrix);

	mat4.translate(translateMatrix, translateMatrix,[0.0,0.6,-3.5]);
	mat4.multiply(modelMatrix,translateMatrix,modelMatrix);

	// send mvp and other uniforms
	gl.uniformMatrix4fv(uniform_ModelMatrix,false,modelMatrix);							// model Matrix
	gl.uniformMatrix4fv(uniform_ViewMatrix,false,viewMatrix);							// view Matrix
	gl.uniformMatrix4fv(uniform_ProjectionMatrix,false,perspectiveProjectionMatrix);	// projection Matrix
	// if showAMC is true send alpha value 1.0, else 0.0
	if(bShowAMC == true)
	{
		gl.uniform1f(uniform_fontAlphaValue, 1.0);										// alpha Value 1.0
	}
	else if(bShowAMC == false)
	{
		gl.uniform1f(uniform_fontAlphaValue, 0.0);										// alpha value 0.0
	}
	gl.uniform3f(uniform_fontopColor,0.0,0.0,1.0);										// font color blue

	// bind to texture 
	gl.bindTexture(gl.TEXTURE_2D,textureM);
	gl.uniform1i(uniform_texture0_sampler_logo_font,0);											// sampler 1

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.bindVertexArray(vertexArrayObject_Square);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	gl.disable(gl.BLEND);

	gl.useProgram(null);
	
	// ********************* Letter C *********************
	gl.useProgram(shaderProgramObject_font);

	mat4.identity(translateMatrix);
	mat4.identity(modelMatrix);

	mat4.translate(translateMatrix, translateMatrix,[0.4,0.6,-3.5]);
	mat4.multiply(modelMatrix,translateMatrix,modelMatrix);

	// send mvp and other uniforms
	gl.uniformMatrix4fv(uniform_ModelMatrix,false,modelMatrix);							// model Matrix
	gl.uniformMatrix4fv(uniform_ViewMatrix,false,viewMatrix);							// view Matrix
	gl.uniformMatrix4fv(uniform_ProjectionMatrix,false,perspectiveProjectionMatrix);	// projection Matrix
	// if showAMC is true send alpha value 1.0, else 0.0
	if(bShowAMC == true)
	{
		gl.uniform1f(uniform_fontAlphaValue, 1.0);										// alpha Value 1.0
	}
	else if(bShowAMC == false)
	{
		gl.uniform1f(uniform_fontAlphaValue, 0.0);										// alpha value 0.0
	}
	gl.uniform3f(uniform_fontopColor,0.0,1.0,0.0);										// font color green

	// bind to texture 
	gl.bindTexture(gl.TEXTURE_2D,textureC);
	gl.uniform1i(uniform_texture0_sampler_logo_font,0);											// sampler 1

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.bindVertexArray(vertexArrayObject_Square);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);

	gl.disable(gl.BLEND);

	gl.useProgram(null);
 
	// animation loop
	samUpdate_font();
}


function samUninitialize_font()
{

	if (vertexArrayObject_Square) 
	{
		gl.deleteVertexArray(vertexArrayObject_Square);
		vertexArrayObject_Square = null;
	}

	if (vertexBufferObject_Square_Position) 
	{
		gl.deleteBuffer(vertexBufferObject_Square_Position);
		vertexBufferObject_Square_Position=null;
	}

	if (vertexBufferObject_Square_Texture) 
	{
		gl.deleteBuffer(vertexBufferObject_Square_Texture);
		vertexBufferObject_Square_Texture=null;
	}


	if (vertexArrayObject_SolidF) 
	{
		gl.deleteVertexArray(vertexArrayObject_SolidF);
		vertexArrayObject_SolidF = null;
	}

	if (vertexBufferObject_SolidF_Position) 
	{
		gl.deleteBuffer(vertexBufferObject_SolidF_Position);
		vertexBufferObject_SolidF_Position=null;
	}

	if (vertexBufferObject_SolidF_Colors) 
	{
		gl.deleteBuffer(vertexBufferObject_SolidF_Colors);
		vertexBufferObject_SolidF_Colors=null;
	}


	if (shaderProgramObject_font) 
	{
		if(fragmentShaderObject_font)
		{
			gl.detachShader(shaderProgramObject_font,fragmentShaderObject_font);
			gl.deleteShader(fragmentShaderObject_font);
			fragmentShaderObject_font=null;
		}

		if (vertexShaderObject_font) 
		{
			gl.detachShader(shaderProgramObject_font,vertexShaderObject_font);
			gl.deleteShader(vertexShaderObject_font);
			vertexShaderObject_font=null;
		}

		gl.deleteProgram(shaderProgramObject_font);
		shaderProgramObject_font=null;
	}

}