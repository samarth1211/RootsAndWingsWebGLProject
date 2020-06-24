//scene1

//Shader related variables
var scene5_Ball_VertexShaderObject =null;
var scene5_Ball_FragmentShaderObject=null;
var scene5_Ball_ShaderProgramObject=null;

//VAO VBO
var scene5_Ball_vao=null;
var scene5_Ball_vbo_position=null;
var scene5_Ball_vbo_normal=null;
var scene5_Ball_vbo_texture=null;
var scene5_Ball_vbo_color=null;

//Uniform variables
var scene5_Ball_ModelMatrix_Uniform=null;
var scene5_Ball_ViewMatrix_Uniform=null;
var scene5_Ball_ProjectionMatrix_Uniform=null;

var scene5_Ball_la_Uniform = null;
var scene5_Ball_ld_Uniform = null;
var scene5_Ball_kd_Uniform = null;
var scene5_Ball_LightPosition_Uniform = null;
var scene5_Ball_uniform_texture0_sampler = null;


//Matrices
var scene5_Ball_ModelMatrix;
var scene5_Ball_ViewMatrix;

//Sphere class Obj
var sphereMesh; 

var scene5_Ball_SphereLightPosition = [100.0, 100.0, 100.0, 1.0];
var sphereTexture = null;
var scene5_Ball_Sphere_Angle = 11.0;

var animate_ball = 1.0;





//Functions call by others
function scene5_Ball_Init()
{
    var scene5_Ball_VertexShaderSourceCode = 
	"	#version 300 es																" +
	"																			\n	" +
	"	in vec4 vPosition;															" +
	"	in vec3 vNormal;															" +
	"	in vec2 vTexture0_Coord;													" +
	"																			\n	" +
    "	uniform mat4 u_m_matrix;													" +
	"	uniform mat4 u_v_matrix;													" +
	"	uniform mat4 u_p_matrix;													" +
	"	uniform vec3 u_la;															" + 
    "	uniform vec3 u_ld;															" +
	"	uniform vec3 u_kd;															" +
	"	uniform vec3 u_light_position;												" +
	"																			\n	" +
	"	out vec3 difuse_light;														" +
	"	out vec2 out_texture0_coord;												" +
	"																			\n	" +
	"	void main(void)																" +
	"	{																			" +
	"		vec4 eyeCoord = u_v_matrix * u_m_matrix * vPosition;					" +
	"		vec3 tnorm = normalize(mat3(u_v_matrix * u_m_matrix) * vNormal);		" +
	"		vec3 s = normalize(vec3(u_light_position - (eyeCoord).xyz));			" +
	"		difuse_light = u_la + (u_ld * u_kd * max(dot(s, tnorm), 0.0));			" +
	"		out_texture0_coord = vTexture0_Coord;									" +
	"		gl_Position = u_p_matrix *  u_v_matrix * u_m_matrix * vPosition;		" +
	"	}																			";
	
	scene5_Ball_VertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(scene5_Ball_VertexShaderObject,scene5_Ball_VertexShaderSourceCode);
	gl.compileShader(scene5_Ball_VertexShaderObject);
	
	if(gl.getShaderParameter(scene5_Ball_VertexShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(scene5_Ball_VertexShaderObject);
		if(error.length > 0)
		{
			alert("VERTEXT SHADER EROOR");
			scene5_Ball_Uninitialize();
		}
	}
	
	//fragment shader
	var scene5_Ball_FragmentShaderSourceCode = 
	"	#version 300 es																" +
	"																			\n	" +
	"	precision highp float;														" +
	"																			\n	" +
	"	in vec3 difuse_light;														" +
	"	in vec2 out_texture0_coord;													" +
	"																			\n	" +
	"	uniform highp sampler2D u_texture0_sampler;									" +
	"																			\n	" +
	"	out  vec4 FragColor;														" +
	"																			\n	" +
	"	void main(void)																" +
	"	{																			" +
	"		highp vec4 tex = texture(u_texture0_sampler, out_texture0_coord);		" +
	"		FragColor = vec4((tex.rgb * difuse_light), 1.0);						" +
	"	}																			";
	
	scene5_Ball_FragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(scene5_Ball_FragmentShaderObject,scene5_Ball_FragmentShaderSourceCode);
	gl.compileShader(scene5_Ball_FragmentShaderObject);
	
	if(gl.getShaderParameter(scene5_Ball_FragmentShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(scene5_Ball_FragmentShaderObject);
		if(error.length > 0)
		{
			alert("FRAGMENT SHADER EROOR: " + error);
			scene5_Ball_Uninitialize();
		}
	}
	//shader program
	scene5_Ball_ShaderProgramObject = gl.createProgram();
	gl.attachShader(scene5_Ball_ShaderProgramObject, scene5_Ball_VertexShaderObject);
	gl.attachShader(scene5_Ball_ShaderProgramObject, scene5_Ball_FragmentShaderObject);
	
	//prelinking
	gl.bindAttribLocation(scene5_Ball_ShaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(scene5_Ball_ShaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_NORMAL, "vNormal");
	gl.bindAttribLocation(scene5_Ball_ShaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,"vTexture0_Coord");
	//linking
	gl.linkProgram(scene5_Ball_ShaderProgramObject);
	if(!gl.getProgramParameter(scene5_Ball_ShaderProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(scene5_Ball_ShaderProgramObject);
		if(error.length > 0)
		{
				alert("LINK ERROR : "+ error);
				scene5_Ball_Uninitialize();
		}
	}
	
	//Post Link getting uniforms locations
	//mvp
    scene5_Ball_ModelMatrix_Uniform = gl.getUniformLocation(scene5_Ball_ShaderProgramObject, "u_m_matrix");   
	scene5_Ball_ViewMatrix_Uniform = gl.getUniformLocation(scene5_Ball_ShaderProgramObject, "u_v_matrix");
    scene5_Ball_ProjectionMatrix_Uniform = gl.getUniformLocation(scene5_Ball_ShaderProgramObject, "u_p_matrix");
	
	//light
	scene5_Ball_la_Uniform = gl.getUniformLocation(scene5_Ball_ShaderProgramObject, "u_la");
	scene5_Ball_ld_Uniform = gl.getUniformLocation(scene5_Ball_ShaderProgramObject, "u_ld");
	scene5_Ball_kd_Uniform = gl.getUniformLocation(scene5_Ball_ShaderProgramObject, "u_kd");
	scene5_Ball_LightPosition_Uniform = gl.getUniformLocation(scene5_Ball_ShaderProgramObject,"u_light_position");

	//Tetxure
	scene5_Ball_uniform_texture0_sampler = gl.getUniformLocation(scene5_Ball_ShaderProgramObject,"u_texture0_sampler");
	
	////////////******Vertices color texcoord, vao vbo*****///////////
	//Load Sphere Data
	sphereMesh = new Mesh();
	//call syntax makeSphere(sphereMesh, fRadius, iSlices, iStacks)
	makeSphere(sphereMesh, 2.0, 100, 50);

	//create Vao abo for rectangle
	



	///Texture Gen
	//START:
	sphereTexture = gl.createTexture();
	sphereTexture.image = new Image();
	sphereTexture.image.src = "sphere.png";
	sphereTexture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //Changing Y axis
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sphereTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //if NEAREST use ..no need to use mipmap
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	//init wings
	wings_init();

}

//Draw 
function scene5_Ball_Draw()
{
    
	
	if(bHop1 == true)
	{
		//Draw required shapes
		gl.useProgram(scene5_Ball_ShaderProgramObject);
	
		//light
		gl.uniform3f(scene5_Ball_la_Uniform, 0.2,0.2,0.2);
		gl.uniform3f(scene5_Ball_ld_Uniform,1.0,1.0,1.0);
		gl.uniform3f(scene5_Ball_kd_Uniform,.5,.5,.5);

		scene5_Ball_ModelMatrix=mat4.create();
    	scene5_Ball_ViewMatrix = mat4.create();
		
		var translateMatrix = mat4.create();
    	var scaleMatrix = mat4.create();
    	var rotationMatrix = mat4.create();
		
		mat4.translate(translateMatrix, translateMatrix,[-4.7 + trans_ball_x, 2.0 + trans_ball_y , -5.0]);
		mat4.rotateX(rotationMatrix, rotationMatrix, scene5_Ball_Sphere_Angle);
		mat4.scale(scaleMatrix,scaleMatrix, vec3.fromValues(0.10,0.10,0.10));

		mat4.multiply(scene5_Ball_ModelMatrix,rotationMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix, scaleMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix,translateMatrix,scene5_Ball_ModelMatrix);
		
		//Push uniforms
		gl.uniformMatrix4fv(scene5_Ball_ModelMatrix_Uniform,false,scene5_Ball_ModelMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ViewMatrix_Uniform,false,scene5_Ball_ViewMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ProjectionMatrix_Uniform,false,perspectiveProjectionMatrix);

		//Bind with texture
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.uniform1i(scene5_Ball_uniform_texture0_sampler, 0);
		
    	//Draw shapes
		sphereMesh.draw();
		gl.useProgram(null);
	}
	else if(bHop2 == true)
	{
		scene5_Ball_ModelMatrix=mat4.create();
    	scene5_Ball_ViewMatrix = mat4.create();
		
		var translateMatrix = mat4.create();
    	var scaleMatrix = mat4.create();
    	var rotationMatrix = mat4.create();
		
		mat4.translate(translateMatrix, translateMatrix,[-2.0 + trans_ball_x,2.0+trans_ball_y,-5.0]);
		mat4.rotateX(rotationMatrix, rotationMatrix, scene5_Ball_Sphere_Angle);
		mat4.scale(scaleMatrix,scaleMatrix, vec3.fromValues(0.10,0.10,0.10));

		mat4.multiply(scene5_Ball_ModelMatrix,rotationMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix, scaleMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix,translateMatrix,scene5_Ball_ModelMatrix);
		
		gl.useProgram(scene5_Ball_ShaderProgramObject);
		//Push uniforms
		gl.uniformMatrix4fv(scene5_Ball_ModelMatrix_Uniform,false,scene5_Ball_ModelMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ViewMatrix_Uniform,false,scene5_Ball_ViewMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ProjectionMatrix_Uniform,false,perspectiveProjectionMatrix);

		//Bind with texture
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.uniform1i(scene5_Ball_uniform_texture0_sampler, 0);
		
    	//Draw shapes
		sphereMesh.draw();
		gl.useProgram(null);
	}
	else if( bHop3 == true)
	{
		scene5_Ball_ModelMatrix=mat4.create();
    	scene5_Ball_ViewMatrix = mat4.create();
		
		var translateMatrix = mat4.create();
    	var scaleMatrix = mat4.create();
    	var rotationMatrix = mat4.create();
		
		mat4.translate(translateMatrix, translateMatrix,[0.37 + trans_ball_x,2.0+trans_ball_y,-5.0]);
		mat4.rotateX(rotationMatrix, rotationMatrix, scene5_Ball_Sphere_Angle);
		mat4.scale(scaleMatrix,scaleMatrix, vec3.fromValues(0.10,0.10,0.10));

		mat4.multiply(scene5_Ball_ModelMatrix,rotationMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix, scaleMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix,translateMatrix,scene5_Ball_ModelMatrix);
		
		gl.useProgram(scene5_Ball_ShaderProgramObject);
		//Push uniforms
		gl.uniformMatrix4fv(scene5_Ball_ModelMatrix_Uniform,false,scene5_Ball_ModelMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ViewMatrix_Uniform,false,scene5_Ball_ViewMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ProjectionMatrix_Uniform,false,perspectiveProjectionMatrix);

		//Bind with texture
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.uniform1i(scene5_Ball_uniform_texture0_sampler, 0);
		
    	//Draw shapes
		sphereMesh.draw();
		gl.useProgram(null);
	}
	else if(bHop4 == true)
	{
		scene5_Ball_ModelMatrix=mat4.create();
    	scene5_Ball_ViewMatrix = mat4.create();
		
		var translateMatrix = mat4.create();
    	var scaleMatrix = mat4.create();
    	var rotationMatrix = mat4.create();
		
		mat4.translate(translateMatrix, translateMatrix,[3.10 + trans_ball_x,1.95 + trans_ball_y,-5.0]);
		mat4.rotateX(rotationMatrix, rotationMatrix, scene5_Ball_Sphere_Angle);
		mat4.scale(scaleMatrix,scaleMatrix, vec3.fromValues(0.10,0.10,0.10));

		mat4.multiply(scene5_Ball_ModelMatrix,rotationMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix, scaleMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix,translateMatrix,scene5_Ball_ModelMatrix);
		
		gl.useProgram(scene5_Ball_ShaderProgramObject);
		//Push uniforms
		gl.uniformMatrix4fv(scene5_Ball_ModelMatrix_Uniform,false,scene5_Ball_ModelMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ViewMatrix_Uniform,false,scene5_Ball_ViewMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ProjectionMatrix_Uniform,false,perspectiveProjectionMatrix);

		//Bind with texture
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.uniform1i(scene5_Ball_uniform_texture0_sampler, 0);
		
    	//Draw shapes
		sphereMesh.draw();
		gl.useProgram(null);
	}
	else if(bHop5 == true )
	{
		wings_draw();
		//
		gl.useProgram(scene5_Ball_ShaderProgramObject);
		
		scene5_Ball_ModelMatrix=mat4.create();
    	scene5_Ball_ViewMatrix = mat4.create();
		
		var translateMatrix = mat4.create();
    	var scaleMatrix = mat4.create();
    	var rotationMatrix = mat4.create();
		
		mat4.translate(translateMatrix, translateMatrix,[3.0 + trans_ball_x,2.0 + trans_ball_y,-5.0]);

		mat4.rotateX(rotationMatrix, rotationMatrix, scene5_Ball_Sphere_Angle);

		mat4.scale(scaleMatrix,scaleMatrix, vec3.fromValues(0.10,0.10,0.10));

		mat4.multiply(scene5_Ball_ModelMatrix,rotationMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix, scaleMatrix,scene5_Ball_ModelMatrix);
		mat4.multiply(scene5_Ball_ModelMatrix,translateMatrix,scene5_Ball_ModelMatrix);
		gl.useProgram(scene5_Ball_ShaderProgramObject);
		//Push uniforms
		gl.uniformMatrix4fv(scene5_Ball_ModelMatrix_Uniform,false,scene5_Ball_ModelMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ViewMatrix_Uniform,false,scene5_Ball_ViewMatrix);
		gl.uniformMatrix4fv(scene5_Ball_ProjectionMatrix_Uniform,false,perspectiveProjectionMatrix);

		//Bind with texture
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.uniform1i(scene5_Ball_uniform_texture0_sampler, 0);
		
    	//Draw shapes
		sphereMesh.draw();
		gl.useProgram(null);
	}
	gl.useProgram(null);
	
	scene5_Ball_Update();
}

//update
function scene5_Ball_Update()
{
	animate_ball = animate_ball + 1.0;
	if(bHop1 == true)
	{
		if(path1_index < 147)
		{
			if((animate_ball%3)==0)
			path1_index = path1_index+3;

			trans_ball_x = parabolaPath1[path1_index];
			trans_ball_y = parabolaPath1[path1_index+1];
			trans_ball_z = parabolaPath1[path1_index+2];
		}
		else
		{
			bHop1 = false;
			bHop2 = true;
			path1_index = 0

			trans_ball_x = 0;
			trans_ball_y = 0;
			trans_ball_z = 0;
		}
	}
	if(bHop2 == true)
	{
		if(path2_index < 298)
		{
			if((animate_ball % 3)==0)
			path2_index = path2_index+3;

			trans_ball_x = parabolaPath2[path2_index];
			trans_ball_y = parabolaPath2[path2_index+1];
			trans_ball_z = parabolaPath2[path2_index+2];
		}
		else
		{
			bHop2 = false;
			bHop3 = true;
			path2_index = 6;
			//path2_index = 0;

			trans_ball_x = 0;
			trans_ball_y = 0;
			trans_ball_z = 0;
		}
	}
	if(bHop3 == true)
	{
		if(path2_index < 298)
		{
			if((animate_ball % 3)==0)
			path2_index = path2_index+3;

			trans_ball_x = parabolaPath2[path2_index];
			trans_ball_y = parabolaPath2[path2_index+1];
			trans_ball_z = parabolaPath2[path2_index+2];
		}
		else
		{
			bHop3 = false;
			bHop4 = true;
			path2_index = 0;
			path1_index = 0

			trans_ball_x = 0;
			trans_ball_y = 0;
			trans_ball_z = 0;
		}
	}
	if(bHop4 == true)
	{
		if(path1_index < 147)
		{
			if((animate_ball % 3)==0)
			path1_index = path1_index+3;

			trans_ball_x = parabolaPath4[path1_index];
			trans_ball_y = parabolaPath4[path1_index+1];
			trans_ball_z = parabolaPath4[path1_index+2];
		}
		else
		{
			bHop4 = false;
			trans_ball_x = 0;
			trans_ball_y = 0;
			trans_ball_z = 0;
		}
	}
	if(bHop4 == false && path1_index == 147)
	{
		if(bHop1==false && bHop2 == false && bHop3 == false && bHop4 == false)
		{

			bHop5 = true;
			path4_index = 147;
			trans_ball_x = parabolaPath4[path4_index];
			trans_ball_y = parabolaPath4[path4_index + 1];

		
		}
		
	}
}

function scene5_Ball_Uninitialize()
{
	if(scene5_Ball_vao)
	{
		gl.deleteVertexArray(scene5_Ball_vao);
		scene5_Ball_vao = null;
	}

	if(scene5_Ball_vbo_position)
	{
		gl.deleteBuffer(scene5_Ball_vbo_position);
		scene5_Ball_vbo_position = null;
	}

	if(scene5_Ball_vbo_color)
	{
        gl.deleteBuffer(scene5_Ball_vbo_color);
		scene5_Ball_vbo_color = null;
    }
    if(scene5_Ball_vbo_texture)
	{
        gl.deleteBuffer(scene5_Ball_vbo_texture);
		scene5_Ball_vbo_texture = null;
    }
    if(scene5_Ball_vbo_normal)
	{
        gl.deleteBuffer(scene5_Ball_vbo_normal);
		scene5_Ball_vbo_normal = null;
	}
    
     if(scene5_Ball_FragmentShaderObject)
	 {
	 	gl.detachShader(scene5_Ball_ShaderProgramObject, scene5_Ball_FragmentShaderObject);
	 	gl.deleteShader(scene5_Ball_FragmentShaderObject);
	 	scene5_Ball_FragmentShaderObject = null;

	 }

	 if(scene5_Ball_VertexShaderObject)
	 {
	 	gl.detachShader(scene5_Ball_ShaderProgramObject, scene5_Ball_VertexShaderObject);
	 	scene5_Ball_VertexShaderObject = null;

     }
            
	if(scene5_Ball_ShaderProgramObject)
	{
		gl.deleteProgram(scene5_Ball_ShaderProgramObject);
		scene5_Ball_ShaderProgramObject = null;
	}
}

