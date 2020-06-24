var text_VertexShaderObject;
var text_FragmentShaderObject;
var text_ShaderProgramObject;

var text_vertexArrayObject_Square;
var text_vertexBufferObject_Square_Position;
var text_vertexBufferObject_Square_Texture;

var text_uniform_ModelMatrix;
var text_uniform_ViewMatrix;
var text_uniform_ProjectionMatrix;
var text_uniform_AlphaValue;

var textSingle=[];
var text_uniform_texture0_sampler;
var finalTex=null;
// font variable
var textCtx ;

function Text_Init()
{
	textCtx = document.createElement("canvas").getContext("2d");

	// vertex shader
	var vertexShaderSourceCode = 
	"#version 300 es"+
	"\n"+
	"in vec4 vPosition;"+
	"in vec2 vTexture0_Coord;"+
	"out vec2 out_texture0_coord;"+
	"uniform mat4 u_model_matrix;"+
	"uniform mat4 u_view_matrix;"+
	"uniform mat4 u_projection_matrix;"+
	"void main (void)"+
	"{"+
		"gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;"+
		"out_texture0_coord = vTexture0_Coord;"+
	"}";
	text_VertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(text_VertexShaderObject,vertexShaderSourceCode);
	gl.compileShader(text_VertexShaderObject);
	if (gl.getShaderParameter(text_VertexShaderObject,gl.COMPILE_STATUS)==false) 
	{
		var error = gl.getShaderInfoLog(text_VertexShaderObject);
		if (error.length > 0) 
		{
			alert(error);
			text_Uninitialize();
		}
	}

	// fragment shader
	var fragmentShaderSourceCode = 
	"#version 300 es"+
	"\n"+
	"precision highp float;"+
	"in vec2 out_texture0_coord;"+
	"out vec4 FragColor;"+
	"uniform highp sampler2D u_texture0_sampler;"+
	"uniform float u_alphaValue;"+
	"void main (void)"+
	"{"+
		"vec4 temp_color = texture(u_texture0_sampler,out_texture0_coord);"+
		"if(temp_color.r == 0.0 && temp_color.g == 0.0 && temp_color.b == 0.0)"+
		"{"+
			"discard;"+
		"}"+
		"else"+
		"{"+
			"FragColor = vec4(temp_color.r,temp_color.g,temp_color.b,u_alphaValue);"+
		"}"+
	"}";
	
	text_FragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(text_FragmentShaderObject,fragmentShaderSourceCode);
	gl.compileShader(text_FragmentShaderObject);

	if (!gl.getShaderParameter(text_FragmentShaderObject,gl.COMPILE_STATUS)) 
	{
		var error = gl.getShaderInfoLog(text_FragmentShaderObject);
		if (error.length > 0) 
		{
			alert(error);
			text_Uninitialize();
		}
	}

	// shader program
	text_ShaderProgramObject = gl.createProgram();
	gl.attachShader(text_ShaderProgramObject,text_VertexShaderObject);
	gl.attachShader(text_ShaderProgramObject,text_FragmentShaderObject);

	// pre-link building of shader
	gl.bindAttribLocation(text_ShaderProgramObject,WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(text_ShaderProgramObject,WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,"vTexture0_Coord");

	//link
	gl.linkProgram(text_ShaderProgramObject);
	if (!gl.getProgramParameter(text_ShaderProgramObject,gl.LINK_STATUS)) 
	{
		var error = gl.getProgramParameter(text_ShaderProgramObject,gl.LINK_STATUS);
		if (error.length > 0) 
		{
			alert(error);
			text_Uninitialize();
		}
	}

	// mvp location 
	text_uniform_ModelMatrix = gl.getUniformLocation(text_ShaderProgramObject,"u_model_matrix");

	text_uniform_ViewMatrix = gl.getUniformLocation(text_ShaderProgramObject,"u_view_matrix");

	text_uniform_ProjectionMatrix = gl.getUniformLocation(text_ShaderProgramObject,"u_projection_matrix");

	text_uniform_texture0_sampler = gl.getUniformLocation(text_ShaderProgramObject, "u_texture0_sampler");
	text_uniform_AlphaValue = gl.getUniformLocation(text_ShaderProgramObject, "u_alphaValue");
	

	/*	Setup for solid F Stop  */
	// Vertices, colors, shader, vbo and vao initalization	
	var squareVertices = new Float32Array([
		 8.5, 1.0, 0.0,
		-8.5, 1.0, 0.0,
		-8.5, -1.0, 0.0,
		 8.5, -1.0, 0.0
	]);

	var squareTexCoords = new Float32Array([
		1.0, 0.0,
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0
	]);

	text_vertexArrayObject_Square = gl.createVertexArray();
	gl.bindVertexArray(text_vertexArrayObject_Square);
	
	text_vertexBufferObject_Square_Position = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, text_vertexBufferObject_Square_Position);
	gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	text_vertexBufferObject_Square_Texture=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, text_vertexBufferObject_Square_Texture);
	gl.bufferData(gl.ARRAY_BUFFER,squareTexCoords,gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	/*Create Text Texture Start */
}

function createTextTexture(fontsStrings,widthText,heightText,colorText)
{
    var textTex=[];
    for(var i=0;i<fontsStrings.length;i++)
	{
		var textCanvas = text_makeTextCanvas(fontsStrings[i],widthText,heightText,colorText);
		textTex[i] = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D,textTex[i]);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textCanvas);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D,null);
    }
	
	
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    return textTex;
}
function  text_Update()
{
}

function text_makeTextCanvas(text,width,height,color)
{
	textCtx.canvas.width = width;
	textCtx.canvas.height = height;
	textCtx.font ="300px Verdana";
	textCtx.textAlign = "center";
	textCtx.textBaseline = "middle";
	textCtx.fillStyle = color;
	textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
	textCtx.fillText(text, width / 2, height / 2);
	return textCtx.canvas;
}


function text_Uninitialize()
{

	if (text_vertexArrayObject_Square) 
	{
		gl.deleteVertexArray(text_vertexArrayObject_Square);
		text_vertexArrayObject_Square = null;
	}

	if (text_vertexBufferObject_Square_Position) 
	{
		gl.deleteBuffer(text_vertexBufferObject_Square_Position);
		text_vertexBufferObject_Square_Position=null;
	}

	if (text_vertexBufferObject_Square_Texture) 
	{
		gl.deleteBuffer(text_vertexBufferObject_Square_Texture);
		text_vertexBufferObject_Square_Texture=null;
	}

    if(text_FragmentShaderObject)
    {
        gl.detachShader(text_ShaderProgramObject,text_FragmentShaderObject);
        gl.deleteShader(text_FragmentShaderObject);
        text_FragmentShaderObject=null;
    }

    if (text_VertexShaderObject) 
    {
        gl.detachShader(text_ShaderProgramObject,text_VertexShaderObject);
        gl.deleteShader(text_VertexShaderObject);
        text_VertexShaderObject=null;
    }
    if (text_ShaderProgramObject) 
    {    
		gl.deleteProgram(text_ShaderProgramObject);
		text_ShaderProgramObject=null;
	}
}

