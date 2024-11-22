<%@ page import="java.util.Calendar" %>
<%@ page import="com.onelogin.saml2.Auth" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%
    pageContext.getRequest().setCharacterEncoding("UTF-8");
%>
<fmt:setLocale value="sk"/>
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title>Webssodemo</title>
</head>
<body>
<div>
    <a href="/">
        Home
    </a> |
    <a href="/protected/index.jsp" title="Keď kliknete sem, najpr vás to prihlási">Služba</a> |

    <c:choose>
        <c:when test="${!empty sessionScope.attributes}">
            ${sessionScope.attributes.get("Subject.FormattedName").iterator().next()}
            |
            <a href="/logout">Odhlásenie</a>
        </c:when>
        <c:otherwise>
            <a href="/login">Prihlásenie</a>
        </c:otherwise>
    </c:choose>
</div>
<hr>