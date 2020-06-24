var title_text_VertexShaderObject;
var title_text_FragmentShaderObject;
var title_text_ShaderProgramObject;

var title_text_vertexArrayObject_Square	= null;
var title_text_vertexBufferObject_Square_Position = null;
var title_text_vertexBufferObject_Square_Texture = null;

var title_text_uniform_ModelMatrix;
var title_text_uniform_ViewMatrix;
var title_text_uniform_ProjectionMatrix;
var title_text_uniform_AlphaValue;
var title_text_uniform_ColorValue;

var title_textSingle=[];
var title_uniform_texture0_sampler;
var title_finalTex=null;
// font variable
var title_textCtx ;

function title_text_Init()
{
	title_textCtx = document.createElement("canvas").getContext("2d");

	// vertex shader
	var vertexShaderSourceCode = 
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
	"		gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;		"+
	"		out_texture0_coord = vTexture0_Coord;												"+
	"	}																						";
	title_text_VertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(title_text_VertexShaderObject,vertexShaderSourceCode);
	gl.compileShader(title_text_VertexShaderObject);
	if (gl.getShaderParameter(title_text_VertexShaderObject,gl.COMPILE_STATUS)==false) 
	{
		var error = gl.getShaderInfoLog(title_text_VertexShaderObject);
		if (error.length > 0) 
		{
			alert(error);
			text_Uninitialize();
		}
	}

	// fragment shader
	var fragmentShaderSourceCode = 
	"	#version 300 es																	"+
	"																				\n	"+
	"	precision highp float;															"+
	"	in vec2 out_texture0_coord;														"+
	"																				\n	"+
	"	out vec4 FragColor;																"+
	"																				\n	"+
	"	uniform highp sampler2D u_texture0_sampler;										"+
	"	uniform float u_alphaValue;														"+
	"	uniform vec3 u_colorValue;													\n	"+
	"																				\n	"+
	"	void main (void)																"+
	"	{																				"+
	"		vec4 temp_color = texture(u_texture0_sampler,out_texture0_coord);			"+
	"		if(temp_color.r == 0.0 && temp_color.g == 0.0 && temp_color.b == 0.0)		"+
	"		{																			"+
	"			discard;																"+
	"		}																			"+
	"		else																		"+
	"		{																			"+
	"			FragColor = vec4(u_colorValue,u_alphaValue);							"+
	"		}																			"+
	"	}																				";
	
	title_text_FragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(title_text_FragmentShaderObject,fragmentShaderSourceCode);
	gl.compileShader(title_text_FragmentShaderObject);

	if (!gl.getShaderParameter(title_text_FragmentShaderObject,gl.COMPILE_STATUS)) 
	{
		var error = gl.getShaderInfoLog(title_text_FragmentShaderObject);
		if (error.length > 0) 
		{
			alert(error);
			text_Uninitialize();
		}
	}

	// shader program
	title_text_ShaderProgramObject = gl.createProgram();
	gl.attachShader(title_text_ShaderProgramObject,title_text_VertexShaderObject);
	gl.attachShader(title_text_ShaderProgramObject,title_text_FragmentShaderObject);

	// pre-link building of shader
	gl.bindAttribLocation(title_text_ShaderProgramObject,WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(title_text_ShaderProgramObject,WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,"vTexture0_Coord");

	//link
	gl.linkProgram(title_text_ShaderProgramObject);
	if (!gl.getProgramParameter(title_text_ShaderProgramObject,gl.LINK_STATUS)) 
	{
		var error = gl.getProgramParameter(title_text_ShaderProgramObject,gl.LINK_STATUS);
		if (error.length > 0) 
		{
			alert(error);
			text_Uninitialize();
		}
	}

	// mvp location 
	title_text_uniform_ModelMatrix = gl.getUniformLocation(title_text_ShaderProgramObject,"u_model_matrix");
	title_text_uniform_ViewMatrix = gl.getUniformLocation(title_text_ShaderProgramObject,"u_view_matrix");
	title_text_uniform_ProjectionMatrix = gl.getUniformLocation(title_text_ShaderProgramObject,"u_projection_matrix");
	title_text_uniform_texture0_sampler = gl.getUniformLocation(title_text_ShaderProgramObject, "u_texture0_sampler");
	title_text_uniform_AlphaValue = gl.getUniformLocation(title_text_ShaderProgramObject, "u_alphaValue");
	title_text_uniform_ColorValue = gl.getUniformLocation(title_text_ShaderProgramObject, "u_colorValue");
	

	/*	Setup for solid F Stop  */
	// Vertices, colors, shader, vbo and vao initalization	
	var squareVertices = new Float32Array([
		 15.5, 1.0, 0.0,
		-15.5, 1.0, 0.0,
		-15.5, -1.0, 0.0,
		 15.5, -1.0, 0.0
	]);

	var squareTexCoords = new Float32Array([
		1.0, 0.0,
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0
	]);

	title_text_vertexArrayObject_Square = gl.createVertexArray();
	gl.bindVertexArray(title_text_vertexArrayObject_Square);
	
	title_text_vertexBufferObject_Square_Position = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, title_text_vertexBufferObject_Square_Position);
	gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	title_text_vertexBufferObject_Square_Texture=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, title_text_vertexBufferObject_Square_Texture);
	gl.bufferData(gl.ARRAY_BUFFER,squareTexCoords,gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindVertexArray(null);

	/*Create Text Texture Start */
}

function title_createTextTexture(fontsStrings,widthText,heightText,colorText)
{
    var textTex=[];
    for(var i=0;i<fontsStrings.length;i++)
	{
		var textCanvas = title_text_makeTextCanvas(fontsStrings[i],widthText,heightText,colorText);
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

function title_text_makeTextCanvas(text,width,height,color)
{
	title_textCtx.canvas.width = width;
	title_textCtx.canvas.height = height;
	title_textCtx.font ="300px Verdana";
	title_textCtx.textAlign = "center";
	title_textCtx.textBaseline = "middle";
	title_textCtx.fillStyle = color;
	title_textCtx.clearRect(0, 0, title_textCtx.canvas.width, title_textCtx.canvas.height);
	title_textCtx.fillText(text, width / 2, height / 2);
	return title_textCtx.canvas;
}


function title_text_Uninitialize()
{

	if (title_text_vertexArrayObject_Square) 
	{
		gl.deleteVertexArray(title_text_vertexArrayObject_Square);
		title_text_vertexArrayObject_Square = null;
	}

	if (title_text_vertexBufferObject_Square_Position) 
	{
		gl.deleteBuffer(title_text_vertexBufferObject_Square_Position);
		title_text_vertexBufferObject_Square_Position=null;
	}

	if (title_text_vertexBufferObject_Square_Texture) 
	{
		gl.deleteBuffer(title_text_vertexBufferObject_Square_Texture);
		title_text_vertexBufferObject_Square_Texture=null;
	}

    if(title_text_FragmentShaderObject)
    {
        gl.detachShader(title_text_ShaderProgramObject,title_text_FragmentShaderObject);
        gl.deleteShader(title_text_FragmentShaderObject);
        title_text_FragmentShaderObject=null;
    }

    if (title_text_VertexShaderObject) 
    {
        gl.detachShader(title_text_ShaderProgramObject,title_text_VertexShaderObject);
        gl.deleteShader(title_text_VertexShaderObject);
        title_text_VertexShaderObject=null;
    }
    if (title_text_ShaderProgramObject) 
    {    
		gl.deleteProgram(title_text_ShaderProgramObject);
		title_text_ShaderProgramObject=null;
	}
}

