var subs1_VertexShaderObject;
var subs1_FragmentShaderObject;
var subs1_ShaderProgramObject;

var vertexArrayObject_Square;
var vertexBufferObject_Square_Position;
var vertexBufferObject_Square_Texture;
var QuestionTexture=[];
var finalTex=[];
// font variable
var textCtx ;

var s1_Qusetions = ["Comfort zone", "Job Security", "Relatives", "Is it my cup of tea??", "Want to come in computers", "Basics", "Career", "Life Goals", "Scope"];
var finalQuestion = ["I need to overcome it!!"];
var showFinalQuestion=false;
var fallQuestions=false;
var readyforScene2=false;
var translationFactorZ = [-70.0, -70.0, -70.0, -70.0, -70.0, -70.0, -70.0, -70.0, -70.0];
var translationFactorX = [-13.0, 12.5, 10.0, 10.0, -9.5, 8.5, -1.0, -12.00, -8.25];
var translationFactorY = [-7.0, -5.5, 1.0, 5.5, 5.5, -2.5, 8.0, 0.75, -3.0];


var QuestionsSelectedRandomly=[false,false,false,false,false,false,false,false,false];
var QuestionsCnt=0;
var cnt=0;

function subS1_Init()
{
	
	QuestionTexture=createTextTexture(s1_Qusetions,5000,310,"green");
	finalTex=createTextTexture(finalQuestion,5000,310,"blue");	
}

function  subS1_Update()
{
	for(i=0;i<translationFactorZ.length;i++)
	{
		if(translationFactorZ[i]<-17.0)
		{
			if(QuestionsSelectedRandomly[i]==true)
			{
				translationFactorZ[i]+=0.09;
			}
		}
	}

	cnt++;
	if (global_audio_counter == 837)
	{
		QuestionsSelectedRandomly[0]=true;
	}
	if (global_audio_counter == 1022)
	{
		QuestionsSelectedRandomly[1]=true;
	}
	if (global_audio_counter == 1343)
	{
		QuestionsSelectedRandomly[2]=true;
	}
	if (global_audio_counter == 1560)
	{
		QuestionsSelectedRandomly[3]=true;
	}
	
	if (global_audio_counter == 1781)
	{
		QuestionsSelectedRandomly[4]=true;
	}

	if (global_audio_counter == 1981)
	{
		QuestionsSelectedRandomly[5]=true;
	}

	if (global_audio_counter == 2177)
	{
		QuestionsSelectedRandomly[8]=true;
	}

	if (global_audio_counter == 2374)
	{
		QuestionsSelectedRandomly[7]=true;
	}
/*
	if (global_audio_counter == 2461) {
		QuestionsSelectedRandomly[8] = true;
	}*/

	if (global_audio_counter == 2561)
	{
		showFinalQuestion=true;
	}
	
	if (global_audio_counter == 2800)
	{
		readyforScene2=true;
		showFinalQuestion=false;
	}

}

function subS1_Draw()
{
	var modelMatrix=mat4.create();
	var viewMatrix=mat4.create();
	var translateMatrix = mat4.create();

	gl.useProgram(text_ShaderProgramObject);
		for(var i=0;i<QuestionTexture.length;i++)
		{			
			if(QuestionsSelectedRandomly[i]==true)
			{
				modelMatrix=mat4.create();
				viewMatrix=mat4.create();
				translateMatrix=mat4.create();
				
				if(fallQuestions==false)
				{
					mat4.translate(translateMatrix, translateMatrix,[translationFactorX[i],translationFactorY[i],translationFactorZ[i]]);
					mat4.multiply(modelMatrix,translateMatrix,modelMatrix);
				}
				else
				{
					translationFactorY[i]=translationFactorY[i]-0.5;
					mat4.translate(translateMatrix, translateMatrix,[translationFactorX[i],translationFactorY[i],translationFactorZ[i]]);
					mat4.multiply(modelMatrix,translateMatrix,modelMatrix);
				}

				gl.uniformMatrix4fv(text_uniform_ModelMatrix,false,modelMatrix);
				gl.uniformMatrix4fv(text_uniform_ViewMatrix,false,viewMatrix);
				gl.uniformMatrix4fv(text_uniform_ProjectionMatrix,false,perspectiveProjectionMatrix);

				gl.bindTexture(gl.TEXTURE_2D,QuestionTexture[i]);
				gl.uniform1i(text_uniform_texture0_sampler,0);
				gl.uniform1f(text_uniform_AlphaValue, blackOut_variable);

				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				gl.bindVertexArray(text_vertexArrayObject_Square);
				gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
				gl.bindVertexArray(null);
				gl.disable(gl.BLEND);
			}
		}
		if(showFinalQuestion==true)
		{	
			modelMatrix=mat4.create();
			viewMatrix=mat4.create();
			translateMatrix=mat4.create();
			
			mat4.translate(translateMatrix, translateMatrix,[0.0,3.0,-17.0]);
			mat4.multiply(modelMatrix,translateMatrix,modelMatrix);
				
			gl.uniformMatrix4fv(text_uniform_ModelMatrix,false,modelMatrix);
			gl.uniformMatrix4fv(text_uniform_ViewMatrix,false,viewMatrix);
			gl.uniformMatrix4fv(text_uniform_ProjectionMatrix,false,perspectiveProjectionMatrix);

			gl.bindTexture(gl.TEXTURE_2D,finalTex[0]);
			gl.uniform1i(text_uniform_texture0_sampler,0);

			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			gl.bindVertexArray(text_vertexArrayObject_Square);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
			gl.bindVertexArray(null);
			gl.disable(gl.BLEND);
		}
	gl.useProgram(null);
	subS1_Update();
}


function subS1_Uninitialize()
{
	// finalTex
	for (var i = 0; i < QuestionTexture.length ; i++)
    {
        gl.deleteTexture(QuestionTexture[i]);
        QuestionTexture[i]=null;
    }
	
	for (var i = 0; i < finalTex.length ; i++)
    {
        gl.deleteTexture(finalTex[i]);
        finalTex[i]=null;
    }
	
}