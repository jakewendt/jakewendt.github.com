<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head><style>
body {
	font-family: Calibri;
	font-size: 12pt;
	background-color: #EEEEEE
}
table {
	border-collapse: collapse;
}
table, td, th {
	border: 1px solid black;
}
table thead tr {
	background-color: #BBF;
}
tr {
	vertical-align: top;
}
th {
	text-align: left;
}
td, th {
	padding: 5px;
}
tr.question {
	border-top: 3px double black;
}
</style></head>
<body>

<p><xsl:value-of select="/study/introduction"/></p>

<h2>Questions</h2>
<table><thead><tr>
	<th>ID</th>
	<th>Ordering</th>
	<th>subjectType</th>
	<th>Title</th>
	<th colspan="2">Prompt</th>
<!--
	<th>Dependency</th>
-->
</tr></thead><tbody>

<xsl:apply-templates select="/study/questions/question[@subjectType='EGO_ID']">
	<xsl:sort select="@ordering" data-type="number"/>
</xsl:apply-templates>
<xsl:apply-templates select="/study/questions/question[@subjectType='EGO']">
	<xsl:sort select="@ordering" data-type="number"/>
</xsl:apply-templates>
<xsl:apply-templates select="/study/questions/question[@subjectType='ALTER']">
	<xsl:sort select="@ordering" data-type="number"/>
</xsl:apply-templates>
<!--
<xsl:apply-templates select="/study/questions/question[@subjectType='NETWORK']">
	<xsl:sort select="@ordering" data-type="number"/>
</xsl:apply-templates>
-->

</tbody></table>

</body>
</html>
</xsl:template><!-- match="/" -->

<xsl:template match="question">
	<tr class='question'>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@id"/></td>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@ordering"/></td>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@subjectType"/></td>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@title"/></td>
		<td>
			<xsl:attribute name="colspan">2</xsl:attribute>
			<xsl:value-of select="prompt"/></td>
<!--
Seems browsers don't use XSL 2.0 and therefore no functions?
			<xsl:variable name='prompt' select="prompt"/>
			<xsl:value-of select="replace( $prompt, 'br', '' )"/>
</td>
			<xsl:value-of select="fn:replace( prompt, 'br', '')"/></td>
-->
<!--
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
<xsl:if test="@answerReasonExpressionId != ''">
Expression:<xsl:value-of select="@answerReasonExpressionId"/>
<xsl:variable name="expid" select="@answerReasonExpressionId" /><br/>
QuestionId:<xsl:value-of select="/study/expressions/expression[@id=$expid]/@questionId"/><br/>
Name:<xsl:value-of select="/study/expressions/expression[@id=$expid]/@name"/><br/>
Value:<xsl:value-of select="/study/expressions/expression[@id=$expid]/value"/><br/>
</xsl:if></td>
-->
	</tr>
	<xsl:for-each select="./option">
		<xsl:sort select="@ordering" data-type="number"/>
		<tr>
			<td><xsl:value-of select="@value"/></td>
			<td><xsl:value-of select="@name"/></td>
		</tr>
	</xsl:for-each><!-- xsl:for-each select="./option" -->
</xsl:template><!-- match="question" -->

</xsl:stylesheet>
