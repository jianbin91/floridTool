<?php

addSeo();
replaceCdn();


function addSeo()
{
	$filePath = __DIR__.'/../dist/index.html';
	echo $filePath,PHP_EOL;
	$replaceContent = '<head>';
	$replaceContent .= '<title>seo</title>';
	$replaceContent .= '<meta name="keywords" content="seo">';
	$replaceContent .= '<meta name="description" content="seo">';


	$content = file_get_contents($filePath);

	if (!$content){
		exit('no content');
	}

	$content = str_replace('<head>', $replaceContent, $content);

	file_put_contents($filePath, $content);

	echo ' add seo info ok';
	echo PHP_EOL;
}


function replaceCdn() {

	$arr1 = [ 'https://unpkg.com/antd@3.26.6/dist/antd.min.css' => 'http://xxx/travel-static/antd.min.css'];
	$arr2 = [ 'https://unpkg.com/react@16.12.0/umd/react.profiling.min.js' => 'http://xxx/travel-static/react.profiling.min.js'];
	$arr3 = [ 'https://unpkg.com/react@16.12.0/umd/react.production.min.js' => 'http://xxx/travel-static/react.production.min.js'];
	$arr4 = [ 'https://unpkg.com/react-dom@16.12.0/umd/react-dom.production.min.js' => 'http://xxx/travel-static/react-dom.production.min.js'];
	$arr5 = [ 'https://unpkg.com/moment@2.24.0/min/moment-with-locales.min.js' => 'http://xxx/travel-static/moment-with-locales.min.js'];
	$arr6 = [ 'https://unpkg.com/antd@3.26.6/dist/antd-with-locales.min.js' => 'http://xxx/travel-static/antd-with-locales.min.js'];

	$arr = $arr1 + $arr2 +$arr3 + $arr4 + $arr5 + $arr6;

	$filePath = __DIR__.'/../dist/index.html';
	echo $filePath,PHP_EOL;

	$content = file_get_contents($filePath);

	if (!$content){
		exit('no content');
	}

	foreach($arr as $key=>$val){
		$content = str_replace($key, $val, $content);
	}

	file_put_contents($filePath, $content);

	echo 'cdn repalce ok';
	echo PHP_EOL;
}



