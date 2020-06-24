
// shader objects
var wings_vertexShaderObject;
var wings_fragmentShaderObject;
var wings_shaderProgramObject;

var wingLeftTexture = 0;
var wingRightTexture = 0;
var uniform_texture0_sampler;
//wings texture
var s2_vao_wing_rectangle =null;
var s2_vbo_wing_rectangle_pos = null;

var s2_vbo_wing_rectangle_texture = null;

var mvUniform;
var pUniform;

var tagline=["Make your roots strong, wings will let you fly . . ."];
var taglineTexture=[];

function wings_init()
{
    Text_Init();
	//taglineTexture=createTextTexture(tagline,8000,560,"#e5e8e8");
    taglineTexture=createTextTexture(tagline,8000,560,"#b3b6b7");

	//vertexShader code
	var vertexShaderSourceCode = 
	"#version 300 es" +
	"\n" +
	"in vec4 vPosition;" +
	"in vec2 vTexture0_Coord;" +
    "uniform mat4 u_mv_matrix;" +
    "uniform mat4 u_p_matrix;" +
	"out vec2 out_texture0_coord;" +
	"void main(void)" +
	"{" +
		"gl_Position = u_p_matrix * u_mv_matrix * vPosition;" +
		"out_texture0_coord = vTexture0_Coord;" +
	"}";
	
	wings_vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(wings_vertexShaderObject,vertexShaderSourceCode);
	gl.compileShader(wings_vertexShaderObject);
	
	if(gl.getShaderParameter(wings_vertexShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(wings_vertexShaderObject);
		if(error.length > 0)
		{
			alert("VERTEXT SHADER EROOR");
			wing_uninitialize();
		}
	}

	console.log("Vertex Shader completed!!!");
	//fragment shader
	var fragmentShaderSourceCode = 
	"#version 300 es" +
	"\n" +
	
	"precision highp float;" +
	"in vec2 out_texture0_coord;" +
	"uniform highp sampler2D u_texture0_sampler;" +
	"out  vec4 FragColor;" +
	"void main(void)" +
	"{" +
        "vec4 tex = texture(u_texture0_sampler, out_texture0_coord);" +
        "if(tex.r == 1.0 && tex.g == 1.0 && tex.b == 1.0)" +
        "{" +
            "discard;" +
        "}" +
        "else" +
        "{" +
            "FragColor = vec4(179.0/256.0, 182.0/256.0, 183.0/256.0,1.0);" +
        "}" + 

	"}";
	
	wings_fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(wings_fragmentShaderObject,fragmentShaderSourceCode);
	gl.compileShader(wings_fragmentShaderObject);
	
	if(gl.getShaderParameter(wings_fragmentShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(wings_fragmentShaderObject);
		if(error.length > 0)
		{
			alert("FRAGMENT SHADER EROOR: " + error);
			wing_uninitialize();
		}
	}

	console.log("Fragment Shader completed!!!");

	//shader program
	wings_shaderProgramObject = gl.createProgram();
	gl.attachShader(wings_shaderProgramObject, wings_vertexShaderObject);
	gl.attachShader(wings_shaderProgramObject, wings_fragmentShaderObject);
	
	console.log("Attaching Shaders completed!!!");
	//prelinking
	gl.bindAttribLocation(wings_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(wings_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, "vTexture0_Coord");

	console.log("Prelinking Shader completed!!!");
	//linking
	gl.linkProgram(wings_shaderProgramObject);
	if(!gl.getProgramParameter(wings_shaderProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(wings_shaderProgramObject);
		if(error.length > 0)
		{
				alert("LINK ERROR : "+ error);
				wing_uninitialize();
		}
	}
	console.log("Shader Program linking completed!!!");

	//Post Link..getting uniforms locations
	mvUniform = gl.getUniformLocation(wings_shaderProgramObject, "u_mv_matrix");
    pUniform =  gl.getUniformLocation(wings_shaderProgramObject, "u_p_matrix");

	uniform_texture0_sampler = gl.getUniformLocation(wings_shaderProgramObject, "u_texture0_sampler");

	console.log("Post link  completed!!!");

	////////////******Vertices color texcoord, vao vbo*****///////////
	

	var rectangleVertices = new Float32Array([
												1.0, 1.0, 0.0,
												-1.0, 1.0, 0.0,
												-1.0, -1.0, 0.0,
												1.0, -1.0, 0.0
											]);

	var rectangle_texcoords = new Float32Array([
												1.0, 1.0,
												0.0, 1.0,
												0.0, 0.0,
												1.0, 0.0
										]);


	
	
	//rectangle
	//START:
	s2_vao_wing_rectangle = gl.createVertexArray();
	gl.bindVertexArray(s2_vao_wing_rectangle);

	s2_vbo_wing_rectangle_pos = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, s2_vbo_wing_rectangle_pos);
	gl.bufferData(gl.ARRAY_BUFFER, rectangleVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false , 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//texcoord
	s2_vbo_wing_rectangle_texture = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, s2_vbo_wing_rectangle_texture);
	gl.bufferData(gl.ARRAY_BUFFER, rectangle_texcoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false , 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	gl.bindVertexArray(null);
	//END:

	//Texture Gen
	//START:
	console.log("Texture Gen Started!!!");
	wingLeftTexture = gl.createTexture();
	wingLeftTexture.image = new Image();
	wingLeftTexture.image.src = "leftWing.png";
	wingLeftTexture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, wingLeftTexture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //Changing Y axis
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wingLeftTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //if NEAREST use ..no need to use mipmap
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
    //right texture
    wingRightTexture = gl.createTexture();
	wingRightTexture.image = new Image();
	wingRightTexture.image.src = "rightWing.png";
	wingRightTexture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, wingRightTexture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //Changing Y axis
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wingRightTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //if NEAREST use ..no need to use mipmap
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	console.log("Texture Gen End!!!");
	//END:

}



function wings_draw()
{
    gl.useProgram(text_ShaderProgramObject);
	var modelMatrix=mat4.create();
	var viewMatrix=mat4.create();
	var translateMatrix=mat4.create();
	
	mat4.translate(translateMatrix, translateMatrix,[0.0,-3.0,-20.0]);
	//mat4.rotate();
	mat4.multiply(modelMatrix,modelMatrix,translateMatrix);
	

	gl.uniformMatrix4fv(text_uniform_ModelMatrix,false,modelMatrix);
	gl.uniformMatrix4fv(text_uniform_ViewMatrix,false,viewMatrix);
	gl.uniformMatrix4fv(text_uniform_ProjectionMatrix,false,perspectiveProjectionMatrix);

	gl.bindTexture(gl.TEXTURE_2D,taglineTexture[0]);
	gl.uniform1i(text_uniform_texture0_sampler,0);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.bindVertexArray(text_vertexArrayObject_Square);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);
	gl.disable(gl.BLEND);
	gl.useProgram(null);


    ////////////////////////////////
	gl.useProgram(wings_shaderProgramObject);

	
	var modelViewMatrix = mat4.create();
    var scaleMatrix = mat4.create();
    
	
    //mat4.scale(scaleMatrix,scaleMatrix, vec3.fromValues(0.05,0.05,0.05));
    
    mat4.multiply(modelViewMatrix, modelViewMatrix,scaleMatrix);
    
    //mat4.translate(modelViewMatrix, modelViewMatrix, [6.0 + trans_ball_x,5.0 + trans_ball_y,-5.0]);
    mat4.translate(modelViewMatrix, modelViewMatrix, [3.57,1.5,-5.0]);

    gl.uniformMatrix4fv(mvUniform, false, modelViewMatrix);
    gl.uniformMatrix4fv(pUniform, false, perspectiveProjectionMatrix);

	//Bind with texture
	//STRAT:
		gl.bindTexture(gl.TEXTURE_2D, wingLeftTexture);
		gl.uniform1i(uniform_texture0_sampler, 0);
	//END:


	//wings_draw required shapes
	//STRAT:
	//triangle
	gl.bindVertexArray(s2_vao_wing_rectangle);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null) ;

    //2nd wing
    mat4.identity(modelViewMatrix);
	
    //mat4.translate(modelViewMatrix, modelViewMatrix, [6.0 + trans_ball_x,5.0 + trans_ball_y,-5.0]);
   
    mat4.translate(modelViewMatrix, modelViewMatrix, [2.31,1.5,-5.0]);
    
    gl.uniformMatrix4fv(mvUniform, false, modelViewMatrix);
    gl.uniformMatrix4fv(pUniform, false, perspectiveProjectionMatrix);
 
    gl.uniform1i(uniform_texture0_sampler, 0);

    //Bind with texture
	//STRAT:
		gl.bindTexture(gl.TEXTURE_2D, wingRightTexture);
		gl.uniform1i(uniform_texture0_sampler, 0);
    //END:
    
    gl.bindVertexArray(s2_vao_wing_rectangle);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null) ;
	
	//END:

	gl.useProgram(null);

}

function wing_uninitialize()
{
	
	if (wingRightTexture)
	{
		gl.deleteTexture(wingRightTexture);
		wingRightTexture=null;
	}

	if (wingLeftTexture) 
	{
		gl.deleteTexture(wingLeftTexture);
		wingLeftTexture = null;
	}
	/////rect
	if(s2_vao_wing_rectangle)
	{
		gl.deleteVertexArray(s2_vao_wing_rectangle);
		s2_vao_wing_rectangle = null;
	}

	if(s2_vbo_wing_rectangle_pos)
	{
		gl.deleteBuffer(s2_vbo_wing_rectangle_pos);
		s2_vbo_wing_rectangle_pos = null;
	}

	if(s2_vbo_wing_rectangle_texture)
	{
        gl.deleteBuffer(s2_vbo_wing_rectangle_texture);
		s2_vbo_wing_rectangle_texture = null;
	}


	if(wings_shaderProgramObject)
	{
			if(wings_fragmentShaderObject)
			{
				gl.detachShader(wings_shaderProgramObject, wings_fragmentShaderObject);
				gl.deleteShader(wings_fragmentShaderObject);
				wings_fragmentShaderObject = null;

			}

			if(wings_vertexShaderObject)
			{
				gl.detachShader(wings_shaderProgramObject, wings_vertexShaderObject);
				gl.deleteShader(wings_vertexShaderObject);
				wings_vertexShaderObject = null;

			}
			gl.deleteProgram(wings_shaderProgramObject);
			wings_shaderProgramObject = null;
	}
}
