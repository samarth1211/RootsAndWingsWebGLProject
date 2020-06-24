//Obj 
var modelA = {}, modelM ={}, modelC ={}, modelAsub ={}, modelMsub = {}, modelCsub = {}; 

modelA.lstNormal=[];
modelA.lstPosition=[];
modelA.lstTexCoord=[];
modelA.lstIndices=[];

modelM.lstNormal=[];
modelM.lstPosition=[];
modelM.lstTexCoord=[];
modelM.lstIndices=[];

modelC.lstNormal=[];
modelC.lstPosition=[];
modelC.lstTexCoord=[];
modelC.lstIndices=[];

modelAsub.lstNormal=[];
modelAsub.lstPosition=[];
modelAsub.lstTexCoord=[];
modelAsub.lstIndices=[];

modelMsub.lstNormal=[];
modelMsub.lstPosition=[];
modelMsub.lstTexCoord=[];
modelMsub.lstIndices=[];

modelCsub.lstNormal=[];
modelCsub.lstPosition=[];
modelCsub.lstTexCoord=[];
modelCsub.lstIndices=[];


// shader objects
var model_vertexShaderObject;
var model_fragmentShaderObject;
var model_shaderProgramObject;

//AMC
var vao_AMC = [];
var vbo_AMC = [];
var vbo_Normal_AMC = [];
var vbo_Element_AMC = [];

var x = 0.5;
var translate_x = [-3.9 + x,-3.3 +x ,-1.55 +x, -0.85 +x, 0.58 +x,1.15 +x];
var translate_Y = [-0.5,-0.5,-0.5,-0.5,-0.5,-0.5];

//mvp uniforms
var model_viewMatrix_Uniform;
var model_modelMatrix_Uniform;
var model_projectionMatrix_Uniform;

var angle = 0.0;
//lights ADS
var model_light_ambient_one = [0.0,0.0,0.0];
var model_light_diffuse_one =  [0.0,0.0,0.0];
var model_light_specular_one = [0.0,0.0,0.0];

//light positions
var model_light_position_one = [100.0, 100.0, 100.0, 1.0];

//light materials
var model_material_ambient = [0.0, 0.0, 0.0];

//L1
var model_material_diffuse_one = [1.0, 1.0, 1.0];

var model_material_diffuse_A = [1.0, 0.0, 0.0];
var model_material_diffuse_M = [0.0, 0.0, 1.0];
var model_material_diffuse_C = [0.0, 1.0, 0.0];

var model_material_specular_one = [1.0, 1.0, 1.0];

var model_material_shininess = 120.0;

var model_uniform_LightPosition_one;
var model_uniform_La_one;
var model_uniform_Ld_one;
var model_uniform_Ls_one;
var model_uniform_Ka, model_uniform_Kd_one, model_uniform_Ks_one;
var model_uniform_MaterialShininess;
var model_uniform_LKeyIsPressed;
var model_bLkeyPressed=true;

//end
var lstModelPosition=[];
var lstModelNormal=[];
var lstModelIndices=[];
	
/*variables required for bouncing ball*/
var bHop1 = false;
var bHop2 = false;
var bHop3 = false;
var bHop4 = false;

var bHop5 = false;

var scaleBall = false;
var scaleBallValue = 0.0;

var trans_ball_x =0.0;
var trans_ball_y =0.0;
var trans_balls_Qusetions_z =0.0;

var path1_index = 0;
var path2_index = 0;
var path4_index = 0;


// translation value of ball while hoping is taken from parabola.js file
//------------------------------------//

function model_main()
{
	getAllDataModelSynchtromously();
}

function getAllDataModelSynchtromously()
{
	getObjData(document.URL.slice(0,document.URL.lastIndexOf("/"))+"/models/A.obj",getAllDataModelSynchtromouslyM,modelA);  
}

function getAllDataModelSynchtromouslyM()
{
	getObjData(document.URL.slice(0,document.URL.lastIndexOf("/"))+"/models/M.obj",getAllDataModelSynchtromouslyC,modelM);  
}

function getAllDataModelSynchtromouslyC()
{
	getObjData(document.URL.slice(0,document.URL.lastIndexOf("/"))+"/models/C.obj",getAllDataModelSynchtromouslyStro,modelC);  
}

function getAllDataModelSynchtromouslyStro()
{
	getObjData(document.URL.slice(0,document.URL.lastIndexOf("/"))+"/models/astro.obj",getAllDataModelSynchtromouslyedi,modelAsub);  
}

function getAllDataModelSynchtromouslyedi()
{
	getObjData(document.URL.slice(0,document.URL.lastIndexOf("/"))+"/models/edi.obj",getAllDataModelSynchtromouslyOmp,modelMsub);  
}

function getAllDataModelSynchtromouslyOmp()
{
	getObjData(document.URL.slice(0,document.URL.lastIndexOf("/"))+"/models/omp.obj",model_init,modelCsub);  
}

function model_init()
{
	
	//vertexShader code
	var vertexShaderSourceCode = 
	"#version 300 es" +
	"\n" +
	"in vec4 vPosition;" +
	"in vec3 vNormal;"+

	//light position
	"uniform vec4 u_light_position_one;" +

	"uniform mediump int u_LKeyPressed ;"+	

	"out vec3 transformed_normals;" +
	"out vec3 viewer_vector;"+

	"out vec3 light_direction_one;" +

	"uniform mat4 u_model_matrix;" +
	"uniform mat4 u_view_matrix;" +
	"uniform mat4 u_projection_matrix;" +
	"void main(void)" +
	"{" +
		"if(u_LKeyPressed==1)"+
		"{" +
			"vec4 eyeCoordinates = u_view_matrix * u_model_matrix * vPosition ;" +
			"transformed_normals = (mat3(u_view_matrix * u_model_matrix) * vNormal) ;" +

			"light_direction_one = ( vec3(u_light_position_one) - eyeCoordinates.xyz);"+

			"viewer_vector = (-eyeCoordinates.xyz) ;" +
		"}" +
		"gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;"+
	"}";
	
	model_vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(model_vertexShaderObject,vertexShaderSourceCode);
	gl.compileShader(model_vertexShaderObject);
	
	if(gl.getShaderParameter(model_vertexShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(model_vertexShaderObject);
		if(error.length > 0)
		{
			alert("VERTEXT SHADER EROOR");
			model_uninitialize();
		}
	}
	
	//fragment shader
	var fragmentShaderSourceCode = 
	"#version 300 es" +
	"\n" +
	"precision highp float;" +
	"in vec3 transformed_normals;" +

	"in vec3 light_direction_one;" +

	"in vec3 viewer_vector;" +

	"out vec4 FragColor;"+

	"uniform vec3 u_La_one;" +
	"uniform vec3 u_Ld_one;" +
	"uniform vec3 u_Ls_one;" +

	"uniform vec3 u_Ka;" +
	"uniform vec3 u_Kd_one;" +
	"uniform vec3 u_Ks_one;" +

	"uniform float u_material_shininess;" +
	"uniform int u_LKeyPressed ;" +
	"void main(void)" +
	"{" +
		"vec3 phong_ads_color;"+
		"if(u_LKeyPressed==1)" +
		"{" +
			"vec3 normalized_transformed_normals = normalize(transformed_normals);" +
			"vec3 normalized_viewer_vector = normalize(viewer_vector) ;" +

			"vec3 normalized_light_direction_one = normalize(light_direction_one);" +

			"float tn_dot_ld_one = max(dot(normalized_transformed_normals,normalized_light_direction_one),0.0) ;" +

			"vec3 reflection_vector_one = reflect(-normalized_light_direction_one,normalized_transformed_normals) ;" +

			//L1
			"vec3 ambient_one = u_La_one * u_Ka; " +
			"vec3 diffuse_one = u_Ld_one * u_Kd_one * tn_dot_ld_one;" +
			"vec3 specular_one = u_Ls_one * u_Ks_one * pow(max(dot(reflection_vector_one,normalized_viewer_vector),0.0),u_material_shininess) ;" +

			"vec3 light_one = ambient_one + diffuse_one + specular_one ;" +

			"phong_ads_color =  light_one  ;" +
			"FragColor = vec4(phong_ads_color,1.0) ;"+

		"}" +
		"else"+
		"{"+
			"phong_ads_color = vec3(1.0,1.0,1.0);" +
			"FragColor = vec4(phong_ads_color,1.0) ;"+

		"}"+
	"}";
	
	model_fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(model_fragmentShaderObject,fragmentShaderSourceCode);
	gl.compileShader(model_fragmentShaderObject);
	
	if(gl.getShaderParameter(model_fragmentShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(model_fragmentShaderObject);
		if(error.length > 0)
		{
			alert("FRAGMENT SHADER EROOR");
			model_uninitialize();
		}
	}
	//shader program
	model_shaderProgramObject = gl.createProgram();
	gl.attachShader(model_shaderProgramObject, model_vertexShaderObject);
	gl.attachShader(model_shaderProgramObject, model_fragmentShaderObject);
	
	//prelinking
	gl.bindAttribLocation(model_shaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(model_shaderProgramObject,WebGLMacros.AMC_ATTRIBUTE_NORMAL,"vNormal");

	//linking
	gl.linkProgram(model_shaderProgramObject);
	if(!gl.getProgramParameter(model_shaderProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(model_shaderProgramObject);
		if(error.length > 0)
		{
				alert(error);
				model_uninitialize();
		}
	}
	
	//Post Link..getting uniforms locations
	model_modelMatrix_Uniform= gl.getUniformLocation(model_shaderProgramObject, "u_model_matrix");
	model_viewMatrix_Uniform= gl.getUniformLocation(model_shaderProgramObject, "u_view_matrix");
	model_projectionMatrix_Uniform = gl.getUniformLocation(model_shaderProgramObject, "u_projection_matrix");

	//light uniforms
	model_uniform_La_one = gl.getUniformLocation(model_shaderProgramObject, "u_La_one");
	model_uniform_Ld_one = gl.getUniformLocation(model_shaderProgramObject, "u_Ld_one");
	model_uniform_Ls_one = gl.getUniformLocation(model_shaderProgramObject, "u_Ls_one");

	model_uniform_LightPosition_one = gl.getUniformLocation(model_shaderProgramObject, "u_light_position_one");

	model_uniform_Ka = gl.getUniformLocation(model_shaderProgramObject, "u_Ka");
	model_uniform_Kd_one = gl.getUniformLocation(model_shaderProgramObject, "u_Kd_one");
	model_uniform_Ks_one = gl.getUniformLocation(model_shaderProgramObject, "u_Ks_one");

	model_uniform_MaterialShininess = gl.getUniformLocation(model_shaderProgramObject,"u_material_shininess");

	model_uniform_LKeyIsPressed = gl.getUniformLocation(model_shaderProgramObject, "u_LKeyPressed");

	lstModelPosition=[modelA.lstPosition,modelAsub.lstPosition,modelM.lstPosition,modelMsub.lstPosition,modelC.lstPosition,modelCsub.lstPosition];
	lstModelNormal=[modelA.lstNormal,modelAsub.lstNormal,modelM.lstNormal,modelMsub.lstNormal,modelC.lstNormal,modelCsub.lstNormal];
    lstModelIndices=[modelA.lstIndices,modelAsub.lstIndices,modelM.lstIndices,modelMsub.lstIndices,modelC.lstIndices,modelCsub.lstIndices];
 
	////////////******Vertices color texcoord, vao_A vbo_A*****///////////
	
	//****A****
	for(var iter=0;iter<7;iter++)
	{
		vao_AMC[iter] = gl.createVertexArray();
		gl.bindVertexArray(vao_AMC[iter]);

		vbo_AMC[iter] = gl.createBuffer();

		//console.log("Pos" + lstPosition);
		//position
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo_AMC[iter]);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( lstModelPosition[iter]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false , 0, 0);
		gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		//console.log(lstNormal);
		//normals
		vbo_Normal_AMC[iter]=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,vbo_Normal_AMC[iter]);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lstModelNormal[iter]),gl.STATIC_DRAW);
		gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_NORMAL,3,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_NORMAL);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);


		
		vbo_Element_AMC[iter]=gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,vbo_Element_AMC[iter]);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(lstModelIndices[iter]),gl.STATIC_DRAW);
		//*****M******

		gl.bindVertexArray(null);

	}
	

}


function model_draw()
{
	gl.useProgram(model_shaderProgramObject);
	for(var iter=0;iter<7;iter++)
	{
		if(lstModelIndices[iter]!=undefined || lstModelIndices[iter]==[])
		{
			var modelMatrix = mat4.create();
			var viewMatrix = mat4.create();
			
			mat4.translate(modelMatrix, modelMatrix, [translate_x[iter], translate_Y[iter], -5.0]);

			//push the uniforms
			if (model_bLkeyPressed==true) 
			{
				gl.uniform1i(model_uniform_LKeyIsPressed,1);

				//position
				gl.uniform4fv(model_uniform_LightPosition_one, model_light_position_one);

				gl.uniform3fv(model_uniform_Ka, model_material_ambient);
				if(iter%2==0)
				{
					if(((iter==0 && bHop2 == true) || (iter==0 && bHop3 == true) || (iter==0 &&  bHop4 == true)||(iter==0 &&  bHop5 == true && path1_index == 147)))
					{
						//model_light_ambient_one = [];
						model_light_diffuse_one = [1.0, 0.0, 0.0];
						model_light_specular_one =[1.0, 0.0, 0.0];
						
						model_material_diffuse_one = [1.0, 0.0, 0.0];
						model_material_specular_one = [1.0, 0.0, 0.0];
					}
					else if(((iter==2 && bHop3 == true) || (iter==2 && bHop4 == true)||(iter==2 &&  bHop5 == true && path1_index == 147)))
					{
						model_light_diffuse_one = [0.0, 0.0, 1.0];
						model_light_specular_one =[0.0, 0.0, 1.0];
						
						model_material_diffuse_one = [0.0, 0.0, 1.0];
						model_material_specular_one = [0.0, 0.0, 1.0];
					}
					else if((iter==4 && bHop4 == true)||(iter==4 &&  bHop5 == true && path1_index == 147))
					{
						model_light_diffuse_one = [0.0, 1.0, 0.0];
						model_light_specular_one =[0.0, 1.0, 0.0];
						
						model_material_diffuse_one = [0.0, 1.0, 0.0];
						model_material_specular_one = [0.0, 1.0, 0.0];
					}
					else
					{
						model_light_diffuse_one = [0.8, 0.8, 0.8];
						model_light_specular_one =[0.8, 0.8, 0.8];
						
						model_material_diffuse_one = [0.8, 0.8, 0.8];
						model_material_specular_one = [0.8, 0.8, 0.8];
					}
				}
				else 
				{
					model_light_diffuse_one = [0.8, 0.8, 0.8];
					model_light_specular_one =[0.8, 0.8, 0.8];
					
					model_material_diffuse_one = [0.8, 0.8, 0.8];
					model_material_specular_one = [0.8, 0.8, 0.8];
				}
				gl.uniform3fv(model_uniform_Kd_one, model_material_diffuse_one);
				gl.uniform3fv(model_uniform_Ks_one, model_material_specular_one);

				gl.uniform1f(model_uniform_MaterialShininess, model_material_shininess);
				
			gl.uniform3fv(model_uniform_La_one, model_light_ambient_one);
			gl.uniform3fv(model_uniform_Ld_one, model_light_diffuse_one);
			gl.uniform3fv(model_uniform_Ls_one, model_light_specular_one);

			}
			else
			{
				gl.uniform1i(model_uniform_LKeyIsPressed, 0);
			}
			
			gl.uniformMatrix4fv(model_modelMatrix_Uniform, false, modelMatrix);
			gl.uniformMatrix4fv(model_viewMatrix_Uniform, false, viewMatrix);
			gl.uniformMatrix4fv(model_projectionMatrix_Uniform, false, perspectiveProjectionMatrix);

			//Draw shape
			gl.bindVertexArray(vao_AMC[iter]);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_Element_AMC[iter]);
			gl.drawElements(gl.TRIANGLES,new  Uint16Array(lstModelIndices[iter]).length,gl.UNSIGNED_SHORT, 0);
			gl.bindVertexArray(null);
		}
	}
	gl.useProgram(null);	
}

function model_uninitialize()
{
	for( var iter = 0; iter < 7; iter++)
	{
		if(vao_AMC[iter])
		{
			gl.deleteVertexArray(vao_AMC[iter]);
			vao_AMC[iter] = null;
		}

		if(vbo_AMC[iter])
		{
			gl.deleteBuffer(vbo_AMC[iter]);
			vbo_AMC[iter] = null;
		}

		if(vbo_Normal_AMC[iter])
		{
			gl.deleteBuffer(vbo_Normal_AMC[iter]);
			vbo_Normal_AMC[iter] = null;
		}

		if(vbo_Element_AMC[iter])
		{
			gl.deleteBuffer(vbo_Element_AMC[iter]);
			vbo_Element_AMC[iter] = null;
		}
	}
	
	if(model_shaderProgramObject)
	{
			if(model_fragmentShaderObject)
			{
				gl.detachShader(model_shaderProgramObject, model_fragmentShaderObject);
				gl.deleteShader(model_fragmentShaderObject);
				model_fragmentShaderObject = null;

			}

			if(model_vertexShaderObject)
			{
				gl.detachShader(model_shaderProgramObject, model_vertexShaderObject);
				gl.deleteShader(model_vertexShaderObject);
				model_vertexShaderObject = null;

			}
			gl.deleteProgram(model_shaderProgramObject);
			model_shaderProgramObject = null;
	}

	// model_uninitialize parabola
	parabola_uninitialize();
}

function degToRad(degree)
{
	return (degree * Math.PI/180);
}

function getObjData(filePath,dataloadCallBack,modelType)
{
	//var objPath = ["file:///D:/DomainShader/ModelLoading/NewAMC/models/M.obj","file:///D:/DomainShader/ModelLoading/NewAMC/models/A.obj","file:///D:/DomainShader/ModelLoading/NewAMC/models/C.obj"];
		
	
        new Ajax().get(filePath, (function(name) 
          {
			return function (data, status) 
			{
				if (status === 200) 
				{
					//console.log("Data ",data);
					var aj=parseObjData(data);
					modelType.lstNormal=aj.norms;
					modelType.lstPosition=aj.verts;
					//modelType.lstTexCoord=unpacked.;
					modelType.lstIndices=aj.indices;
					
				}
				else 
				{
				error = true;
				console.error('An error has occurred and the mesh "' +
					name + '" could not be downloaded.');
				}
				
				

				dataloadCallBack();
			}
		})());
	
}

function fillArray(modelType, unpackData)
{

}

var Ajax = function(){
    // this is just a helper class to ease ajax calls
    var _this = this;
    this.xmlhttp = new XMLHttpRequest();

    this.get = function(url, callback){
      _this.xmlhttp.onreadystatechange = function(){
        if(_this.xmlhttp.readyState === 4){
          callback(_this.xmlhttp.responseText, _this.xmlhttp.status);
        }
      };
      _this.xmlhttp.open('GET', url, true);
      _this.xmlhttp.send();
    }
  };

function parseObjData(objectData) {
  
    var verts = [], vertNormals = [], textures = [], unpacked = {};
    // unpacking stuff
    unpacked.verts = [];
    unpacked.norms = [];
    unpacked.textures = [];
    unpacked.hashindices = {};
    unpacked.indices = [];
    unpacked.index = 0;
    // array of lines separated by the newline
    var lines = objectData.split('\n');

    var VERTEX_RE = /^v\s/;
    var NORMAL_RE = /^vn\s/;
    var TEXTURE_RE = /^vt\s/;
    var FACE_RE = /^f\s/;
    var WHITESPACE_RE = /\s+/;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      var elements = line.split(WHITESPACE_RE);
      elements.shift();

      if (NORMAL_RE.test(line))
       {
        // if this is a vertex
        vertNormals.push.apply(vertNormals, elements);
       
      }
      else  if (VERTEX_RE.test(line))
      {
        // if this is a vertex normal
        verts.push.apply(verts, elements);
      } 
      
      else if (TEXTURE_RE.test(line)) {
        // if this is a texture
        textures.push.apply(textures, elements);
      } else if (FACE_RE.test(line)) {
        var quad = false;
        for (var j = 0, eleLen = elements.length; j < eleLen; j++){
            if(j === 3 && !quad) {
                // add v2/t2/vn2 in again before continuing to 3
                j = 2;
                quad = true;
            }
            if(elements[j] in unpacked.hashindices){
                unpacked.indices.push(unpacked.hashindices[elements[j]]);
            }
            else{
                var vertex = elements[ j ].split( '/' );
                // Vertex position
                unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 0]);
                unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 1]);
                unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 2]);
                // Vertex textures
                if (textures.length) {
                  unpacked.textures.push(+textures[(vertex[1] - 1) * 2 + 0]);
                  unpacked.textures.push(+textures[(vertex[1] - 1) * 2 + 1]);
                }
                // Vertex normals
                var xNorm=parseFloat(+vertNormals[(vertex[2] - 1) * 3 + 0]).toFixed(4);
                var yNorm=parseFloat(+vertNormals[(vertex[2] - 1) * 3 + 1]).toFixed(4);
                var zNorm=parseFloat(+vertNormals[(vertex[2] - 1) * 3 + 2]).toFixed(4);
              //  console.log(xNorm," ",yNorm," ",zNorm);
                unpacked.norms.push(xNorm);
                unpacked.norms.push(yNorm);
                unpacked.norms.push(zNorm);
                // add the newly created Vertex to the list of indices
                unpacked.hashindices[elements[j]] = unpacked.index;
                unpacked.indices.push(unpacked.index);
                // increment the counter
                unpacked.index += 1;
            }
            if(j === 3 && quad) {
                // add v0/t0/vn0 onto the second triangle
                unpacked.indices.push( unpacked.hashindices[elements[0]]);
            }
        }
      }
	}
	return(unpacked);
  }